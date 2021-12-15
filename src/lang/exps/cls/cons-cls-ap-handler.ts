import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class ConsClsApHandler extends ApHandler {
  target: Exps.ConsClsValue

  constructor(target: Exps.ConsClsValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Exps.ClsValue {
    return new Exps.FulfilledClsValue(
      this.target.field_name,
      this.target.rest_t_cl.name,
      this.target.field_t,
      arg_value_entry.value,
      this.target.rest_t_cl.apply(arg_value_entry.value)
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
