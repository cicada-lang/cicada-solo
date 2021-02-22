import { Env } from "../env"
import { Ctx } from "../ctx"
import { Exp, AlphaReprOpts } from "../exp"

import * as Value from "../value"

export class Absurd implements Exp {
  kind = "Absurd"

  constructor() {}

  evaluability(env: Env): Value.Value {
    return Value.absurd
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Absurd"
  }
}
