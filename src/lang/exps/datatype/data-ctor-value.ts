import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."
import { DataCtorApHandler } from "./data-ctor-ap-handler"

export type DataCtorBinding = {
  kind: Exps.ArgKind
  name: string
  arg_t: Core
}

export class DataCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  name: string
  t: Core

  constructor(type_ctor: Exps.TypeCtorValue, name: string, t: Core) {
    super()
    this.type_ctor = type_ctor
    this.name = name
    this.t = t
  }

  ap_handler = new DataCtorApHandler(this)

  apply(opts: {
    fixed_args:
      | Array<Value>
      | ((index: number, opts: { arg_t: Value; env: Env }) => Value)
    args:
      | Array<Value>
      | ((index: number, opts: { arg_t: Value; env: Env }) => Value)
    // NOTE Application can be partial,
    //   which will be used by `CurriedDataCtorValue.readback`
    length?: number
  }): {
    env: Env
    fixed_arg_t_values: Array<Value>
    arg_t_value_entries: Array<{ kind: Exps.ArgKind; arg_t: Value }>
  } {
    const { fixed_args, args, length } = opts

    const result = this.type_ctor.apply_fixed({ fixed_args })

    let env = result.env
    const arg_t_value_entries: Array<{ kind: Exps.ArgKind; arg_t: Value }> = []
    for (const [index, binding] of this.bindings.entries()) {
      if (length && index >= length - this.type_ctor.fixed_arity) break
      const arg_t = evaluate(env, binding.arg_t)
      const arg =
        args instanceof Array ? args[index] : args(index, { arg_t, env })
      env = env.extend(binding.name, arg)
      arg_t_value_entries.push({ kind: binding.kind, arg_t })
    }

    return {
      env,
      fixed_arg_t_values: Object.values(result.arg_t_values),
      arg_t_value_entries,
    }
  }

  get bindings(): Array<DataCtorBinding> {
    return this.split_type().bindings
  }

  get ret_t(): Core {
    return this.split_type().ret_t
  }

  split_type(): { bindings: Array<DataCtorBinding>; ret_t: Core } {
    const bindings: Array<DataCtorBinding> = []
    let t = this.t
    while (true) {
      if (t instanceof Exps.PiCore) {
        bindings.push({
          kind: "plain",
          name: t.name,
          arg_t: t.arg_t,
        })
        t = t.ret_t
      } else if (t instanceof Exps.ImplicitPiCore) {
        bindings.push({
          kind: "implicit",
          name: t.name,
          arg_t: t.arg_t,
        })
        t = t.ret_t
      } else if (t instanceof Exps.VaguePiCore) {
        bindings.push({
          kind: "vague",
          name: t.name,
          arg_t: t.arg_t,
        })
        t = t.ret_t
      } else {
        break
      }
    }

    return { bindings, ret_t: t }
  }

  build_data_pattern(): Core {
    let data_core: Core = new Exps.DotCore(
      new Exps.VarCore(this.type_ctor.name),
      this.name
    )

    for (const binding of this.bindings) {
      data_core = this.build_ap_from_binding(data_core, binding)
    }

    return data_core
  }

  build_case_ret_t(motive: Core): Core {
    // NOTE The `varied_args` of application of type constructor,
    //   if exists, they should be used as
    //   the first few arguments of the application of `motive`.
    //   - The same for building `almost`.
    const { varied_args } = this.type_ctor.analyze_datatype(this.ret_t)
    const target = this.build_data_pattern()
    let case_ret_t: Core = motive
    for (const arg of [...varied_args, target]) {
      case_ret_t = new Exps.ApCore(case_ret_t, arg)
    }

    return case_ret_t
  }

  get is_recursive(): boolean {
    throw new Error("TODO")
  }

  build_almost_t(motive: Core): Core {
    throw new Error("TODO")
  }

  private build_ap_from_binding(core: Core, binding: DataCtorBinding): Core {
    switch (binding.kind) {
      case "plain":
        return new Exps.ApCore(core, new Exps.VarCore(binding.name))
      case "implicit":
        return new Exps.ImplicitApCore(core, new Exps.VarCore(binding.name))
      case "vague":
        return new Exps.VagueApCore(core, new Exps.VarCore(binding.name))
    }
  }

  get arity(): number {
    return this.type_ctor.fixed_arity + this.bindings.length
  }

  readback_t(ctx: Ctx): Core {
    const result = this.type_ctor.apply_fixed_to_not_yet_values()

    let env = result.env.extend(
      this.type_ctor.name,
      new Exps.NotYetValue(
        this.type_ctor.self_type(),
        new Exps.VarNeutral(this.type_ctor.name)
      )
    )

    const t = evaluate(env, this.t)
    const t_core = readback(ctx, new Exps.TypeValue(), t)
    return t_core
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.DotCore(new Exps.VarCore(this.type_ctor.name), this.name)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    // NOTE `TypeCtor` can only be defined at top-level,
    //   thus `DataCtor` must also be defined at top-level,
    //   thus we do not need to handle scope here.
    if (!(that instanceof Exps.DataCtorValue)) {
      return Solution.failure
    }

    if (this.name !== that.name) {
      return Solution.failure
    }

    const this_type_ctor_t = this.type_ctor.self_type()
    const that_type_ctor_t = that.type_ctor.self_type()

    return solution
      .unify_type(ctx, this_type_ctor_t, that_type_ctor_t)
      .unify(ctx, this_type_ctor_t, this.type_ctor, this.type_ctor)
  }
}
