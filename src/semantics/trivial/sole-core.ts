import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Sole extends Core {
  evaluate(env: Env): Value {
    return new Sem.SoleValue()
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "sole"
  }
}
