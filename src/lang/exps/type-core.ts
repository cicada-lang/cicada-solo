import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import * as Exps from "../exps"

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
