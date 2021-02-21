import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Sole extends Object implements Exp {
  kind = "Sole"

  constructor() {
    super()
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.sole
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        return Value.trivial
      },
    }).checkability(t, the)
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.trivial
  }

  repr(): string {
    return "sole"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "sole"
  }
}
