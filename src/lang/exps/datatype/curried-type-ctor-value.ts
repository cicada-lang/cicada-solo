import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."
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
      result = this.apply_pi_type(result, arg)
    }

    return result
  }

  private apply_pi_type(pi: Value, arg: Value): Value {
    if (!(pi instanceof Exps.PiValue)) {
      throw new Error(
        [
          `I expect type_ctor.self_type to be PiValue`,
          `  class name: ${this.type_ctor.self_type.constructor.name}`,
        ].join("\n")
      )
    }

    return pi.ret_t_cl.apply(arg)
  }

  ap_handler = new CurriedTypeCtorApHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    const self_type = this.self_type()

    if (conversion(ctx, new Exps.TypeValue(), t, self_type)) {
      let result: Core = new Exps.VarCore(this.type_ctor.name)
      for (const [index, arg] of this.args.entries()) {
        const arg_t = readback(ctx, this.type_ctor.get_arg_t(index), arg)
        result = new Exps.ApCore(result, arg_t)
      }

      return result
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    throw new Error("TODO")
  }
}
