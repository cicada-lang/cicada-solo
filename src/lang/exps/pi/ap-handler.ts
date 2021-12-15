import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { ArgValueEntry } from "./arg-entry"

export abstract class ApHandler {
  apply?(arg_value_entry: ArgValueEntry): Value

  infer_by_target?(ctx: Ctx, core: Core, arg: Exp): { t: Value; core: Core }
}
