import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Absurd extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new Cores.AbsurdValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Absurd"
  }
}
