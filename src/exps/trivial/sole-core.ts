import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class SoleCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.SoleValue()
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "sole"
  }
}
