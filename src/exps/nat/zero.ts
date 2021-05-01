import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Zero extends Exp {
  evaluate(env: Env): Value {
    return new Cores.ZeroValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.NatValue()
  }

  repr(): string {
    return "0"
  }
}
