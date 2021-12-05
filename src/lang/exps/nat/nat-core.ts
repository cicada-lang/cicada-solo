import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class NatCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.NatValue()
  }

  format(): string {
    return "Nat"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Nat"
  }
}
