import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Str extends Core {
  evaluate(env: Env): Value {
    return new Cores.StrValue()
  }

  repr(): string {
    return "String"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "String"
  }
}
