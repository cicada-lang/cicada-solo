import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { Core, AlphaCtx } from "../../core"
import * as Cores from "../../cores"
import { Value } from "../../value"

export class Absurd extends Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new Cores.AbsurdValue()
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Absurd"
  }
}
