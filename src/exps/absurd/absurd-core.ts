import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class AbsurdCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.AbsurdValue()
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Absurd"
  }
}
