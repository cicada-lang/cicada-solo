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

// TODO need `kind: "plain" | "implicit" | "returned"`
export type DataCtorBinding = { name: string; arg_t: Core }

export class DataCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  name: string
  ret_t: Core
  env: Env

  constructor(
    type_ctor: Exps.TypeCtorValue,
    name: string,
    ret_t: Core,
    env: Env
  ) {
    super()
    this.type_ctor = type_ctor
    this.name = name
    this.ret_t = ret_t
    this.env = env
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.DotCore(new Exps.VarCore(this.type_ctor.name), this.name)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }

  apply_with_fixed(opts: {
    fixed_args: Array<Value>
    args: (index: number, opts: { arg_t: Value; env: Env }) => Value
  }): { env: Env; arg_t_values: Array<Value> } {
    const { fixed_args, args } = opts

    let env = this.type_ctor.apply_fixed(fixed_args)
    const arg_t_values: Array<Value> = []
    for (const [index, binding] of this.bindings.entries()) {
      // TODO handle implicit bindings
      const arg_t = evaluate(env, binding.arg_t)
      const arg = args(index, { arg_t, env })
      env = env.extend(binding.name, arg)
      arg_t_values.push(arg_t)
    }

    return { env, arg_t_values }
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
    return this.bindings.length
  }
}
