import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class CurriedTypeCtorApHandler extends ApHandler {
  target: Exps.CurriedTypeCtorValue

  constructor(target: Exps.CurriedTypeCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not apply TypeCtorValue of arity 0.")
    }

    const args = [...this.target.args, arg]

    if (this.target.arity === 1) {
      return new Exps.DatatypeValue(this.target.type_ctor, args)
    }

    return new Exps.CurriedTypeCtorValue(this.target.type_ctor, args)
  }
}
