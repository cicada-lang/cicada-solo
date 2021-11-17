import { ClsApHandler } from "./cls-ap-handler"
import { Value } from "../../value"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { ExpTrace } from "../../errors"

export class NilClsApHandler extends ClsApHandler {
  apply(arg: Value): Exps.ClsValue {
    throw new ExpTrace(
      [
        `I meet the end of ClsValue`,
        `I can not apply arg to it anymore`,
        `arg class name: ${arg.constructor.name}`,
      ].join("\n") + "\n"
    )
  }

  infer_by_target(
    ctx: Ctx,
    target_core: Core,
    arg: Exp
  ): { t: Value; core: Core } {
    throw new ExpTrace(`The telescope is full.`)
  }
}
