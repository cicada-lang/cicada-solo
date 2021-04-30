import { Exp, AlphaCtx } from "../../exp"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { TypeValue } from "../../exps"
import { TrivialValue } from "../../exps"

export class Trivial implements Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new TrivialValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
