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
    throw new Error("TODO")
    // TODO We also need to handle `TypeCtor` of `arity > 1`.
    // return new Exps.CurriedTypeCtorValue()


  }
}
