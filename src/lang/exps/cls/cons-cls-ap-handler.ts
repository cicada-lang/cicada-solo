import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { check } from "../../exp"

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

  infer_by_target(
    ctx: Ctx,
    target_core: Core,
    arg: Exp
  ): { t: Value; core: Core } {
    const arg_core = check(ctx, arg, this.target.field_t)
    return {
      t: new Exps.TypeValue(),
      core: new Exps.ApCore(target_core, arg_core),
    }
  }
}
