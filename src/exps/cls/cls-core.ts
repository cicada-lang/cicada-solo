import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import * as ut from "../../ut"
import { ClsClosure } from "./cls-closure"

export abstract class ClsCore extends Core {
  instanceofExpsCls = true

  abstract append(cls: Exps.ClsCore): Exps.ClsCore
  abstract field_names: Array<string>
  abstract evaluate(env: Env): Exps.ClsValue
  abstract fields_repr(): Array<string>
  abstract fields_alpha_repr(ctx: AlphaCtx): Array<string>
}
