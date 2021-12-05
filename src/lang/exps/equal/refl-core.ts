import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ReflCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.ReflValue()
  }

  format(): string {
    return "refl"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "refl"
  }
}
