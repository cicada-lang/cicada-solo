import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { Exp, AlphaCtx } from "../../exp"
import { TypeValue } from "../../cores"
import { AbsurdValue } from "../../cores"
import { Value } from "../../value"

export class Absurd extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new AbsurdValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Absurd"
  }
}
