import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Sole extends Exp {
  evaluate(env: Env): Value {
    return new Cores.SoleValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.TrivialValue()
  }

  repr(): string {
    return "sole"
  }
}
