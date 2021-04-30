import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TrivialValue, SoleValue } from "../../cores"

export class Sole implements Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new SoleValue()
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "sole"
  }
}
