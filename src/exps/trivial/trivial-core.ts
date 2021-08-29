import { Core, AlphaCtx } from "../../core"
import { Value, Subst } from "../../value"
import { Env } from "../../env"
import * as Exps from "../../exps"

export class TrivialCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.TrivialValue()
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
