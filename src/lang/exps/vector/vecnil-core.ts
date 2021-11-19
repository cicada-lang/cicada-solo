import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class VecnilCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.VecnilValue()
  }

  format(): string {
    return "vecnil"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "vecnil"
  }
}
