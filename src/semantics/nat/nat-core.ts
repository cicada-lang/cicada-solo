import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class NatCore extends Core {
  evaluate(env: Env): Value {
    return new Sem.NatValue()
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Nat"
  }
}
