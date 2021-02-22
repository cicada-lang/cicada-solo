import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Zero implements Exp {
  kind = "Zero"

  constructor() {}

  evaluability(the: { env: Env }): Value.Value {
    return Value.zero
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.nat
  }

  repr(): string {
    return "0"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "0"
  }
}
