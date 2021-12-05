import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"

export abstract class ApHandler {
  abstract apply(arg: Value): Value

  infer_by_target?(ctx: Ctx, core: Core, arg: Exp): { t: Value; core: Core }

  implicit_apply?(arg: Value): Value
  vague_apply?(arg: Value): Value
}
