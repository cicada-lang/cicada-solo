import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { Core, AlphaCtx } from "../../core"
import { TypeValue } from "../../cores"
import { AbsurdValue } from "../../cores"
import { Value } from "../../value"

export class Absurd implements Core {
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
