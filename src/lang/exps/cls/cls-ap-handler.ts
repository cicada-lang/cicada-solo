import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export abstract class ClsApHandler extends ApHandler {
  abstract apply(arg_value_entry: Exps.ArgValueEntry): Exps.ClsValue

  abstract infer_by_target(
    ctx: Ctx,
    target_core: Core,
    arg: Exp,
  ): { t: Value; core: Core }
}
