import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"

export class Zero implements Exp {
  evaluate(env: Env): Value.Value {
    return Value.zero
  }

  infer(ctx: Ctx): Value.Value {
    return Value.nat
  }

  repr(): string {
    return "0"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "0"
  }
}
