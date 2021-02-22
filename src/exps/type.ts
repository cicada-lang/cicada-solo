import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Type implements Exp {
  kind = "Type"

  constructor() {}

  evaluability(env: Env): Value.Value {
    return Value.type
  }

  inferability(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Type"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Type"
  }
}
