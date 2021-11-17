import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export abstract class ClsApHandler extends ApHandler {
  abstract apply(arg: Value): Exps.ClsValue

  abstract infer_by_target(
    ctx: Ctx,
    target_core: Core,
    arg: Exp
  ): { t: Value; core: Core }
}
