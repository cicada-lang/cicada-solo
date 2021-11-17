import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"

export abstract class ApHandler {
  abstract apply(arg: Value): Value
  infer_by_target?(ctx: Ctx, core: Core, arg: Exp): { t: Value; core: Core }
}
