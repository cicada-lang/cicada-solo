import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class TypeCtorApHandler extends ApHandler {
  target: Exps.TypeCtorValue

  constructor(target: Exps.TypeCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not apply TypeCtorValue of arity 0.")
    } else if (this.target.arity === 1) {
      return new Exps.DatatypeValue(this.target, [arg])
    } else {
      throw new Error("TODO We also need to handle `TypeCtor` of `arity > 1`.")
      // return new Exps.CurriedTypeCtorValue()
    }
  }
}
