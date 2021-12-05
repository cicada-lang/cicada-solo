import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class NilCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.NilValue()
  }

  format(): string {
    return "nil"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "nil"
  }
}
