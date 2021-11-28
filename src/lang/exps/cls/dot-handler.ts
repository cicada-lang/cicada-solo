import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"

export abstract class DotHandler {
  abstract get(name: string): Value
  infer_by_target?(ctx: Ctx, core: Core, name: string): { t: Value; core: Core }
}
