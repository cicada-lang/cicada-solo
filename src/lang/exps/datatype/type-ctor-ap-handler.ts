import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TypeCtorApHandler extends ApHandler {
  target: Exps.TypeCtorValue

  constructor(target: Exps.TypeCtorValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not apply type constructor of arity 0.")
    }

    if (this.target.arity === 1) {
      return new Exps.DatatypeValue(this.target, [arg_value_entry.value])
    }

    return new Exps.CurriedTypeCtorValue(this.target, [arg_value_entry.value])
  }
}
