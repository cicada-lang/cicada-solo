import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class VecnilCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.VecnilValue()
  }

  repr(): string {
    return "vecnil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "vecnil"
  }
}
