import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { TypeValue } from "../core"
import { StrValue } from "../core"

export class Str implements Exp {
  evaluate(env: Env): Value {
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
