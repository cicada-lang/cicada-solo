import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TrivialValue, SoleValue } from "../../cores"

export class Sole extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new SoleValue()
  }

  infer(ctx: Ctx): Value {
    return new TrivialValue()
  }

  repr(): string {
    return "sole"
  }
}
