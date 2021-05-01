import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Str extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new Cores.StrValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "String"
  }
}
