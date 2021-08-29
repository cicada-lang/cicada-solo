import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class StrCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.StrValue()
  }

  repr(): string {
    return "String"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "String"
  }
}
