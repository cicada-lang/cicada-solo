import * as Exps from ".."
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Solution } from "../../solution"
import { conversion, expect, readback, Value } from "../../value"
import { CurriedTypeCtorApHandler } from "./curried-type-ctor-ap-handler"

export class CurriedTypeCtorValue extends Value {
  type_ctor: Exps.TypeCtorValue
  args: Array<Value>

  constructor(type_ctor: Exps.TypeCtorValue, args: Array<Value>) {
    super()
    this.type_ctor = type_ctor
    this.args = args
  }

  get arity(): number {
    return this.type_ctor.arity - this.args.length
  }

  self_type(): Value {
    let result = this.type_ctor.self_type()
    for (const arg of this.args) {
      result = Exps.PiValue.apply(result, arg)
    }

    return result
  }

  ap_handler = new CurriedTypeCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    const self_type = this.self_type()

    if (conversion(ctx, new Exps.TypeValue(), t, self_type)) {
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
    if (!(that instanceof Exps.CurriedTypeCtorValue)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    // TODO `t` in the arguments is not used here.
    const self_type = this.type_ctor.self_type()
    return solution
      .unify(ctx, self_type, this.type_ctor, that.type_ctor)
      .unify_args(ctx, self_type, this.args, that.args)
  }
}
