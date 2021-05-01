import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Nat extends Exp {
  evaluate(env: Env): Value {
    return new Cores.NatValue()
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = new Cores.TypeValue()
    const core = new Cores.Nat()
    return { t, core }
  }

  repr(): string {
    return "Nat"
  }
}
