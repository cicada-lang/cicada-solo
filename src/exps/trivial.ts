import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Trivial implements Exp {
  kind = "Trivial"

  constructor() {}

  evaluate(env: Env): Value.Value {
    return Value.trivial
  }

  infer(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(opts: AlphaCtx): string {
    return "Trivial"
  }
}
