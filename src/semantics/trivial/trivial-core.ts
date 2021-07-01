import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Env } from "../../env"
import * as Sem from "../../sem"

export class Trivial extends Core {
  evaluate(env: Env): Value {
    return new Sem.TrivialValue()
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
