import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Same extends Core {
  evaluate(env: Env): Value {
    return new Cores.SameValue()
  }

  repr(): string {
    return "same"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "same"
  }
}
