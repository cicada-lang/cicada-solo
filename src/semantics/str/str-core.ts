import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Str extends Core {
  evaluate(env: Env): Value {
    return new Sem.StrValue()
  }

  repr(): string {
    return "String"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "String"
  }
}
