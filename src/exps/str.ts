import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Str implements Exp {
  kind = "Str"

  constructor() {}

  evaluate(env: Env): Value.Value {
    return Value.str
  }

  infer(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "String"
  }

  alpha_repr(opts: AlphaCtx): string {
    return "String"
  }
}
