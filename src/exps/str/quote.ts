import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { StrValue } from "../../cores"
import { QuoteValue } from "../../cores"

export class Quote extends Exp {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new QuoteValue(this.str)
  }

  infer(ctx: Ctx): Value {
    return new StrValue()
  }

  repr(): string {
    return `"${this.str}"`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `"${this.str}"`
  }
}
