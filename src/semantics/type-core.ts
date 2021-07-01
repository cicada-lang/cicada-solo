import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import * as Sem from "../sem"

export class Type extends Core {
  evaluate(env: Env): Value {
    return new Sem.TypeValue()
  }

  repr(): string {
    return "Type"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Type"
  }
}
