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

// TODO need `kind: "plain" | "implicit" | "returned"`
export type DataCtorBinding = { name: string; arg_t: Core }

export class DataCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  name: string
  ret_t: Core

  constructor(type_ctor: Exps.TypeCtorValue, name: string, ret_t: Core) {
    super()
    this.type_ctor = type_ctor
    this.name = name
    this.ret_t = ret_t
  }

  ap_handler = new DataCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.DotCore(new Exps.VarCore(this.type_ctor.name), this.name)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }

  apply(opts: {
    fixed_args:
      | Array<Value>
      | ((index: number, opts: { arg_t: Value; env: Env }) => Value)
    args:
      | Array<Value>
      | ((index: number, opts: { arg_t: Value; env: Env }) => Value)
  }): {
    env: Env
    fixed_arg_t_values: Array<Value>
    arg_t_values: Array<Value>
  } {
    const { fixed_args, args } = opts

    const result = this.type_ctor.apply_fixed({ fixed_args })
    let env = result.env
    const arg_t_values: Array<Value> = []
    for (const [index, binding] of this.bindings.entries()) {
      // TODO handle implicit bindings
      const arg_t = evaluate(env, binding.arg_t)
      const arg =
        args instanceof Array ? args[index] : args(index, { arg_t, env })
      env = env.extend(binding.name, arg)
      arg_t_values.push(arg_t)
    }

    return {
      env,
      fixed_arg_t_values: Object.values(result.arg_t_values),
      arg_t_values,
    }
  }

  get bindings(): Array<DataCtorBinding> {
    const bindings: Array<DataCtorBinding> = []
    let t = this.ret_t
    // TODO We should also handle `Exps.ImPiCore`.
    while (t instanceof Exps.PiCore) {
      const { name, arg_t, ret_t } = t
      bindings.push({ name, arg_t })
      t = ret_t
    }

    return bindings
  }

  get arity(): number {
    return this.type_ctor.fixed_arity + this.bindings.length
  }

  get finial_ret_t_core(): Core {
    let ret_t = this.ret_t
    // TODO We should also handle `Exps.ImPiCore`.
    while (ret_t instanceof Exps.PiCore) {
      ret_t = ret_t.ret_t
    }

    return ret_t
  }

  readback_ret_t(ctx: Ctx): Core {
    const result = this.type_ctor.apply_fixed_to_not_yet_values()

    let env = result.env.extend(
      this.type_ctor.name,
      new Exps.NotYetValue(
        this.type_ctor.self_type(),
        new Exps.VarNeutral(this.type_ctor.name)
      )
    )

    const ret_t_value = evaluate(env, this.ret_t)
    const ret_t_core = readback(ctx, new Exps.TypeValue(), ret_t_value)
    return ret_t_core
  }
}
