import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { NatValue, ZeroValue } from "../../cores"

export class Zero implements Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new ZeroValue()
  }

  infer(ctx: Ctx): Value {
    return new NatValue()
  }

  repr(): string {
    return "0"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "0"
  }
}
