import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Quote extends Exp {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new Cores.QuoteValue(this.str)
  }

  infer(ctx: Ctx): Value {
    return new Cores.StrValue()
  }

  repr(): string {
    return `"${this.str}"`
  }
}
