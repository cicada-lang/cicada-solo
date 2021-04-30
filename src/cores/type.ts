import { Core, AlphaCtx } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { TypeValue } from "../cores"

export class Type implements Core {
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
