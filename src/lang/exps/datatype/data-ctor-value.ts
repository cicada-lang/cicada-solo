import * as Exps from ".."
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { ElaborationError } from "../../errors"
import { Solution } from "../../solution"
import { readback, Value } from "../../value"
import { DataCtorApHandler } from "./data-ctor-ap-handler"

export class DataCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  name: string
  t: Core
  original_typings: Array<Exps.DataCtorTyping>

  constructor(
    type_ctor: Exps.TypeCtorValue,
    name: string,
    t: Core,
    original_typings: Array<Exps.DataCtorTyping>,
  ) {
    super()
    this.type_ctor = type_ctor
    this.name = name
    this.t = t
    this.original_typings = original_typings
  }

  ap_handler = new DataCtorApHandler(this)

  as_data(): Exps.DataValue {
    if (this.arity !== 0) {
      throw new Error(`I expect the arity of data constructor to be zero.`)
    }

    return new Exps.DataValue(this, [])
  }

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
    for (const [index, typing] of this.typings.entries()) {
      if (length && index >= length - this.type_ctor.fixed_arity) break
      const arg_t = evaluate(env, typing.core)
      const arg =
        args instanceof Array ? args[index] : args(index, { arg_t, env })
      env = env.extend(typing.name, arg)
      arg_t_value_entries.push({ kind: typing.kind, arg_t })
    }

    return {
      env,
      fixed_arg_t_values: Object.values(result.arg_t_values),
      arg_t_value_entries,
    }
  }

  get typings(): Array<Exps.DataCtorCoreTyping> {
    return this.split_type().typings
  }

  get ret_t(): Core {
    return this.split_type().ret_t
  }

  split_type(): { typings: Array<Exps.DataCtorCoreTyping>; ret_t: Core } {
    const typings: Array<Exps.DataCtorCoreTyping> = []
    let t = this.t
    while (true) {
      if (t instanceof Exps.PiCore) {
        typings.push({
          kind: "plain",
          name: t.name,
          core: t.arg_t,
        })
        t = t.ret_t
      } else if (t instanceof Exps.ImplicitPiCore) {
        typings.push({
          kind: "implicit",
          name: t.name,
          core: t.arg_t,
        })
        t = t.ret_t
      } else if (t instanceof Exps.VaguePiCore) {
        typings.push({
          kind: "vague",
          name: t.name,
          core: t.arg_t,
        })
        t = t.ret_t
      } else {
        break
      }
    }

    return { typings, ret_t: t }
  }

  private build_data_pattern(fixed_arg_names: Array<string>): Core {
    let data_core: Core = new Exps.DotCore(
      new Exps.VarCore(this.type_ctor.name),
      this.name,
    )

    for (const fixed_arg_name of fixed_arg_names) {
      data_core = new Exps.VagueApCore(
        data_core,
        new Exps.VarCore(fixed_arg_name),
      )
    }

    for (const typing of this.typings) {
      data_core = this.build_ap_from_typing(data_core, typing)
    }

    return data_core
  }

  build_ret_t(motive: Core, fixed_arg_names: Array<string>): Core {
    const target = this.build_data_pattern(fixed_arg_names)
    return this.build_case_ret_t(motive, this.ret_t, target)
  }

  private build_case_ret_t(motive: Core, datatype: Core, target: Core): Core {
    // NOTE The `varied_args` of application of type constructor,
    //   if exists, they should be used as
    //   the first few arguments of the application of `motive`.
    //   - The same for building `almost`.
    const { varied_args } = this.type_ctor.analyze_datatype(datatype)
    let case_ret_t: Core = motive
    for (const arg of [...varied_args, target]) {
      case_ret_t = new Exps.ApCore(case_ret_t, arg)
    }

    return case_ret_t
  }

  get is_direct_positive_recursive(): boolean {
    return this.direct_positive_recursive_typings.length > 0
  }

  is_direct_positive_recursive_position(index: number): boolean {
    const typing = this.typings[index]
    return this.is_direct_positive_recursive_arg_t(typing.core)
  }

  direct_positive_recursive_position_name(index: number): string {
    const typing = this.typings[index]
    if (!this.is_direct_positive_recursive_position(index)) {
      throw new Error(
        [
          `I expect position to be direct positive recursive.`,
          `  position index: ${index}`,
        ].join("\n"),
      )
    }

    return typing.name
  }

  private get direct_positive_recursive_typings(): Array<
    Exps.DataCtorCoreTyping & { original_name: string }
  > {
    const enriched_typings: Array<
      Exps.DataCtorCoreTyping & { original_name: string }
    > = []

    for (const [index, typing] of this.typings.entries()) {
      if (this.is_direct_positive_recursive_arg_t(typing.core)) {
        const original_typing = this.original_typings[index]
        if (original_typing === undefined) {
          throw new ElaborationError(
            `I can not find original typing from typing of name: ${typing.name}`,
          )
        }

        enriched_typings.push({
          ...typing,
          original_name: original_typing.name,
        })
      }
    }

    return enriched_typings
  }

  private is_direct_positive_recursive_arg_t(arg_t: Core): boolean {
    if (arg_t instanceof Exps.VarCore) {
      if (arg_t.name === this.type_ctor.name) {
        return true
      } else {
        return false
      }
    } else if (arg_t instanceof Exps.ApCore) {
      return this.is_direct_positive_recursive_arg_t(arg_t.target)
    } else {
      return false
    }
  }

  // NOTE About the field names of `almost`.
  //   When you define a recursive `datatype`
  //   the name of the **direct positive recursive** argument
  //   will be exposed as part of the public interface of the `datatype`.
  build_almost_t(motive: Core): Exps.ClsCore {
    let almost_t: Exps.ClsCore = new Exps.NilClsCore()
    for (const typing of [
      ...this.direct_positive_recursive_typings,
    ].reverse()) {
      const target = new Exps.VarCore(typing.name)
      const case_ret_t = this.build_case_ret_t(motive, typing.core, target)
      almost_t = new Exps.ConsClsCore(
        typing.original_name,
        typing.name,
        case_ret_t,
        almost_t,
      )
    }

    return almost_t
  }

  private build_ap_from_typing(
    core: Core,
    typing: Exps.DataCtorCoreTyping,
  ): Core {
    switch (typing.kind) {
      case "plain":
        return new Exps.ApCore(core, new Exps.VarCore(typing.name))
      case "implicit":
        return new Exps.ImplicitApCore(core, new Exps.VarCore(typing.name))
      case "vague":
        return new Exps.VagueApCore(core, new Exps.VarCore(typing.name))
    }
  }

  get arity(): number {
    return this.type_ctor.fixed_arity + this.typings.length
  }

  readback_t(ctx: Ctx): Core {
    const result = this.type_ctor.apply_fixed_to_not_yet_values()

    let env = result.env.extend(
      this.type_ctor.name,
      new Exps.NotYetValue(
        this.type_ctor.self_type(),
        new Exps.VarNeutral(this.type_ctor.name),
      ),
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
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    if (this.name !== that.name) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    const this_type_ctor_t = this.type_ctor.self_type()
    const that_type_ctor_t = that.type_ctor.self_type()

    return solution
      .unify_type(ctx, this_type_ctor_t, that_type_ctor_t)
      .unify(ctx, this_type_ctor_t, this.type_ctor, this.type_ctor)
  }
}
