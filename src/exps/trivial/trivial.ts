import { Exp } from "../../exp"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { TypeValue } from "../../cores"
import { TrivialValue } from "../../cores"

export class Trivial extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new TrivialValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Trivial"
  }
}
