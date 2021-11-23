import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { check } from "../../exp"
import { readback } from "../../value"
import { Value } from "../../value"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."

export class DatatypeValue extends Value {
  type_ctor: Exps.TypeCtorValue
  args: Array<Value>

  constructor(type_ctor: Exps.TypeCtorValue, args: Array<Value>) {
    super()
    this.type_ctor = type_ctor
    this.args = args
  }

  get_ctor_arg_t_values(name: string, args: Array<Value>): Array<Value> {
    const fixed = this.type_ctor.fixed
    let env = this.type_ctor.env

    for (const [index, [name, arg_t_core]] of Object.entries(fixed).entries()) {
      const arg_t = evaluate(env, arg_t_core)
      const arg = this.args[index]
      env = env.extend(name, arg)
    }

    const ctor_arg_t_values: Array<Value> = []
    for (const [index, binding] of this.type_ctor
      .get_ctor_binding_cores(name)
      .entries()) {
      // TODO ignore implicit `CtorBinding`
      const arg_t = evaluate(env, binding.arg_t)
      const arg = args[index]
      ctor_arg_t_values.push(arg_t)
      env = env.extend(binding.name, arg)
    }

    return ctor_arg_t_values
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      let result: Core = new Exps.VarCore(this.type_ctor.name)
      let self_type = this.type_ctor.self_type()
      for (const [index, arg] of this.args.entries()) {
        const pi = expect(ctx, self_type, Exps.PiValue)
        self_type = Exps.PiValue.apply(pi, arg)
        const arg_t = readback(ctx, pi.arg_t, arg)
        result = new Exps.ApCore(result, arg_t)
      }

      return result
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.DatatypeValue)) {
      return Solution.failure
    }

    // TODO `t` in the arguments is not used here.
    const self_type = this.type_ctor.self_type()
    return solution
      .unify(ctx, self_type, this.type_ctor, that.type_ctor)
      .unify_args(ctx, self_type, this.args, that.args)
  }
}
