import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import { TrivialValue } from "../core"

export class Sole implements Exp {
  evaluate(env: Env): Value.Value {
    return Value.sole
  }

  infer(ctx: Ctx): Value.Value {
    return new TrivialValue()
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "sole"
  }
}
