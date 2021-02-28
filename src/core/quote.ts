import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Value } from "@/value"
import { StrValue } from "@/core"
import { QuoteValue } from "@/core"

export class Quote implements Exp {
  str: string

  constructor(str: string) {
    this.str = str
  }

  evaluate(env: Env): Value {
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
