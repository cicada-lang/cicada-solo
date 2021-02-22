import { Env } from "../env"
import { Ctx } from "../ctx"
import { Exp, AlphaOpts } from "../exp"

import * as Value from "../value"

export class Absurd implements Exp {
  kind = "Absurd"

  constructor() {}

  evaluate(env: Env): Value.Value {
    return Value.absurd
  }

  infer(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(opts: AlphaOpts): string {
    return "Absurd"
  }
}
