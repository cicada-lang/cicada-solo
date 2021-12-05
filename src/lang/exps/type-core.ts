import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import * as Exps from "../exps"
import { Value } from "../value"

export class TypeCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.TypeValue()
  }

  format(): string {
    return "Type"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Type"
  }
}
