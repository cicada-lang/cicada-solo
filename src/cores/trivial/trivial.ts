import { Core, AlphaCtx } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Cores from "../../cores"

export class Trivial extends Core {
  evaluate(env: Env): Value {
    return new Cores.TrivialValue()
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Trivial"
  }
}
