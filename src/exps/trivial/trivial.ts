import { Exp } from "../../exp"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Cores from "../../cores"

export class Trivial extends Exp {
  evaluate(env: Env): Value {
    return new Cores.TrivialValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Trivial"
  }
}
