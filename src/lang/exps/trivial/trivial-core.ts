import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class TrivialCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.TrivialValue()
  }

  format(): string {
    return "Trivial"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
