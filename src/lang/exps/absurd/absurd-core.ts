import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class AbsurdCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.AbsurdValue()
  }

  format(): string {
    return "Absurd"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Absurd"
  }
}
