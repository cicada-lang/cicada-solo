import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class ZeroCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.ZeroValue()
  }

  format(): string {
    return "0"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "0"
  }
}
