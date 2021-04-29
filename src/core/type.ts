import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { TypeValue } from "../core"

export class Type implements Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new TypeValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Type"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Type"
  }
}
