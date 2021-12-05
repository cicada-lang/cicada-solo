import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ZeroCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.ZeroValue()
  }

  format(): string {
    return "0"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "0"
  }
}
