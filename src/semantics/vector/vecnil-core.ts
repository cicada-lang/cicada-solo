import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Vecnil extends Core {
  evaluate(env: Env): Value {
    return new Sem.VecnilValue()
  }

  repr(): string {
    return "vecnil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "vecnil"
  }
}
