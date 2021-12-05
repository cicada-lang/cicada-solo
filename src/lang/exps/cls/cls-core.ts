import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"

export abstract class ClsCore extends Core {
  instanceofExpsCls = true

  abstract append(cls: Exps.ClsCore): Exps.ClsCore
  abstract field_names: Array<string>
  abstract evaluate(env: Env): Exps.ClsValue
  abstract fields_format(): Array<string>
  abstract fields_alpha_format(ctx: AlphaCtx): Array<string>
}
