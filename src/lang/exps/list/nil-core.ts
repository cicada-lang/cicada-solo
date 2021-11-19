import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class NilCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.NilValue()
  }

  format(): string {
    return "nil"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "nil"
  }
}
