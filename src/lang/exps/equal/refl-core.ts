import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class ReflCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.ReflValue()
  }

  repr(): string {
    return "refl"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "refl"
  }
}
