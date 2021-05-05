import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Vecnil extends Core {
  evaluate(env: Env): Value {
    return new Cores.VecnilValue()
  }

  repr(): string {
    return "vecnil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "vecnil"
  }
}
