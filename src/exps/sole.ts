import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Sole implements Exp {
  kind = "Sole"

  constructor() {}

  evaluability(env: Env): Value.Value {
    return Value.sole
  }

  inferability(ctx: Ctx): Value.Value {
    return Value.trivial
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "sole"
  }
}
