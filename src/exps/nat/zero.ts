import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Zero extends Exp {
  evaluate(env: Env): Value {
    return new Cores.ZeroValue()
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t = new Cores.NatValue()
    const core = new Cores.Zero()
    return { t, core }
  }

  repr(): string {
    return "0"
  }
}
