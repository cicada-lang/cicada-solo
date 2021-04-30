import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TypeValue } from "../../exps"
import { StrValue } from "../../exps"

export class Str implements Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new StrValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "String"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "String"
  }
}
