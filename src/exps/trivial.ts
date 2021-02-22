import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Trivial implements Exp {
  kind = "Trivial"

  constructor() {}

  evaluability(env: Env): Value.Value {
    return Value.trivial
  }

  inferability(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Trivial"
  }
}
