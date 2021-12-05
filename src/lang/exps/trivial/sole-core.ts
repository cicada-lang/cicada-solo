import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class SoleCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.SoleValue()
  }

  format(): string {
    return "sole"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "sole"
  }
}
