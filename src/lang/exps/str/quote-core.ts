import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class QuoteCore extends Core {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluate(env: Env): Value {
    return new Exps.QuoteValue(this.str)
  }

  format(): string {
    return `"${this.str}"`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `"${this.str}"`
  }
}
