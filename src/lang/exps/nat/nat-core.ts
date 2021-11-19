import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class NatCore extends Core {
  evaluate(env: Env): Value {
    return new Exps.NatValue()
  }

  format(): string {
    return "Nat"
  }

  alpha_format(ctx: AlphaCtx): string {
    return "Nat"
  }
}
