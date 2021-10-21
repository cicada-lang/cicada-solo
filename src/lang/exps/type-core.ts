import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import * as Exps from "../exps"

export class TypeCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.TypeValue()
  }

  repr(): string {
    return "Type"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Type"
  }
}
