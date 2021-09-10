import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Subst } from "../../subst"
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
