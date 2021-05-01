import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { TypeValue } from "../cores"

export class Type extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new TypeValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Type"
  }
}
