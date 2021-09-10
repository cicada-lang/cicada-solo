import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class QuoteCore extends Core {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluate(env: Env): Value {
    return new Exps.QuoteValue(this.str)
  }

  repr(): string {
    return `"${this.str}"`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `"${this.str}"`
  }
}
