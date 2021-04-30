import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { StrValue } from "../../cores"

export class Str extends Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new StrValue()
  }

  repr(): string {
    return "String"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "String"
  }
}
