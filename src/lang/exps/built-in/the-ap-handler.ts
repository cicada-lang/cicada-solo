import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TheApHandler extends ApHandler {
  target: Exps.TheValue

  constructor(target: Exps.TheValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    throw new Error("TODO")
  }
}
