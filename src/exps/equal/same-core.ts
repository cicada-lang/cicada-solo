import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class SameCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.SameValue()
  }

  repr(): string {
    return "same"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "same"
  }
}
