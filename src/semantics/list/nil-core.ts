import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Nil extends Core {
  evaluate(env: Env): Value {
    return new Sem.NilValue()
  }

  repr(): string {
    return "nil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "nil"
  }
}
