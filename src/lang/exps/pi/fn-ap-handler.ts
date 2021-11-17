import { ApHandler } from "./ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class FnApHandler extends ApHandler {
  target: Exps.FnValue

  constructor(target: Exps.FnValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    return this.target.ret_cl.apply(arg)
  }
}
