import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { StrValue } from "../../cores"
import { QuoteValue } from "../../cores"

export class Quote extends Core {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new QuoteValue(this.str)
  }

  repr(): string {
    return `"${this.str}"`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `"${this.str}"`
  }
}
