import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Nil extends Core {
  evaluate(env: Env): Value {
    return new Cores.NilValue()
  }

  repr(): string {
    return "nil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "nil"
  }
}
