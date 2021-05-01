import { Core, AlphaCtx } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import * as Cores from "../cores"

export class Type extends Core {
  evaluate(env: Env): Value {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Type"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Type"
  }
}
