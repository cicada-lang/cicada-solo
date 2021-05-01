import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { Core, AlphaCtx } from "../../core"
import { AbsurdValue } from "../../cores"
import { Value } from "../../value"

export class Absurd extends Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new AbsurdValue()
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Absurd"
  }
}
