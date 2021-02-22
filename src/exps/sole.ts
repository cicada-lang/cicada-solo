import { Exp, AlphaOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Sole implements Exp {
  kind = "Sole"

  constructor() {}

  evaluate(env: Env): Value.Value {
    return Value.sole
  }

  infer(ctx: Ctx): Value.Value {
    return Value.trivial
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(opts: AlphaOpts): string {
    return "sole"
  }
}
