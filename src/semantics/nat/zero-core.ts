import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Zero extends Core {
  evaluate(env: Env): Value {
    return new Cores.ZeroValue()
  }

  repr(): string {
    return "0"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "0"
  }
}
