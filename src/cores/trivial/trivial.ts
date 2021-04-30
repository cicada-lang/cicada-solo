import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { TypeValue } from "../../cores"
import { TrivialValue } from "../../cores"

export class Trivial extends Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new TrivialValue()
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
