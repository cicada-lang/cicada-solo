import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class StrCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.StrValue()
  }

  format(): string {
    return "String"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "String"
  }
}
