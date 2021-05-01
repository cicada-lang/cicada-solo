import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Nat extends Exp {
  evaluate(env: Env): Value {
    return new Cores.NatValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Nat"
  }
}
