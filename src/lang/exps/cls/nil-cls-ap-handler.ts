import { ClsApHandler } from "./cls-ap-handler"
import { Value } from "../../value"
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
}
