import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class FulfilledClsApHandler extends ApHandler {
  target: Exps.FulfilledClsValue

  constructor(target: Exps.FulfilledClsValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Exps.ClsValue {
    return new Exps.FulfilledClsValue(
      this.target.field_name,
      this.target.local_name,
      this.target.field_t,
      this.target.field,
      this.target.rest_t.ap_handler.apply(arg)
    )
  }

  infer_by_target(
    ctx: Ctx,
    target_core: Core,
    arg: Exp
  ): { t: Value; core: Core } {
    return this.target.rest_t.ap_handler.infer_by_target(ctx, target_core, arg)
  }
}
