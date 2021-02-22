import { Exp, AlphaOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Quote implements Exp {
  kind = "Quote"
  str: string

  constructor(str: string) {
    this.str = str
  }

  evaluate(env: Env): Value.Value {
    return Value.quote(this.str)
  }

  infer(ctx: Ctx): Value.Value {
    return Value.str
  }

  repr(): string {
    return `"${this.str}"`
  }

  alpha_repr(opts: AlphaOpts): string {
    return `"${this.str}"`
  }
}
