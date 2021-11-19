import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class SoleCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.SoleValue()
  }

  format(): string {
    return "sole"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "sole"
  }
}
