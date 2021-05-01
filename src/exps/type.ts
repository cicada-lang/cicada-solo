import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import * as Cores from "../cores"

export class Type extends Exp {
  evaluate(env: Env): Value {
    return new Cores.TypeValue()
  }

  infer(ctx: Ctx): Value {
    return new Cores.TypeValue()
  }

  repr(): string {
    return "Type"
  }
}
