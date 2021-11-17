import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class TypeCtorApHandler extends ApHandler {
  target: Exps.TypeCtorValue

  constructor(target: Exps.TypeCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Exps.DatatypeValue {
    throw new Error()
  }
}
