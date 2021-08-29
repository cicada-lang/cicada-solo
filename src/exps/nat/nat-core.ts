import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class NatCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.NatValue()
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Nat"
  }
}
