import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { TrivialValue, SoleValue } from "../core"

export class Sole implements Exp {
  evaluate(env: Env): Value {
    return new SoleValue()
  }

  infer(ctx: Ctx): Value {
    return new TrivialValue()
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "sole"
  }
}
