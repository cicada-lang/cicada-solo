import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class ConsClsApHandler extends ApHandler {
  target: Exps.ConsClsValue

  constructor(target: Exps.ConsClsValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Exps.ClsValue {
    return new Exps.FulfilledClsValue(
      this.target.field_name,
      this.target.rest_t_cl.local_name,
      this.target.field_t,
      arg,
      this.target.rest_t_cl.apply(arg)
    )
  }
}
