import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class VecnilCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.VecnilValue()
  }

  format(): string {
    return "vecnil"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "vecnil"
  }
}
