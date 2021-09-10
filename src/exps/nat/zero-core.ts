import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Subst } from "../../subst"
import * as Exps from "../../exps"

export class ZeroCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.ZeroValue()
  }

  repr(): string {
    return "0"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "0"
  }
}
