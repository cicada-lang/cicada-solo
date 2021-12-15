import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { Exp } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { ClsApHandler } from "./cls-ap-handler"

export class NilClsApHandler extends ClsApHandler {
  apply(arg_value_entry: Exps.ArgValueEntry): Exps.ClsValue {
    throw new ExpTrace(
      [
        `I meet the end of ClsValue`,
        `I can not apply arg to it anymore`,
        `arg class name: ${arg_value_entry.value.constructor.name}`,
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
