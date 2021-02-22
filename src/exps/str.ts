import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Str implements Exp {
  kind = "Str"

  constructor() {}

  evaluability(env: Env): Value.Value {
    return Value.str
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.type
  }

  repr(): string {
    return "String"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "String"
  }
}
