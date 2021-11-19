import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class AbsurdCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.AbsurdValue()
  }

  format(): string {
    return "Absurd"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Absurd"
  }
}
