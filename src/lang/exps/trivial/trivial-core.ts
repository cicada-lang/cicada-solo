import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Env } from "../../env"
import * as Exps from "../../exps"

export class TrivialCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.TrivialValue()
  }

  format(): string {
    return "Trivial"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
