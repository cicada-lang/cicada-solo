import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class CurriedTypeCtorApHandler extends ApHandler {
  target: Exps.CurriedTypeCtorValue

  constructor(target: Exps.CurriedTypeCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    throw new Error("TODO")
  }
}
