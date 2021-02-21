import { Env } from "../env"
import { Ctx } from "../ctx"
import { Exp, AlphaReprOpts } from "../exp"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Absurd extends Object implements Exp {
  kind = "Absurd"

  constructor() {
    super()
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.absurd
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({ inferability: this.inferability }).checkability(t, the)
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Absurd"
  }
}
