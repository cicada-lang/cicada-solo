import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Quote extends Core {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluate(env: Env): Value {
    return new Cores.QuoteValue(this.str)
  }

  repr(): string {
    return `"${this.str}"`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `"${this.str}"`
  }
}
