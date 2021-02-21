import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Trivial extends Object implements Exp {
  kind = "Trivial"

  constructor() {
    super()
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.trivial
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        return Value.type
      },
    }).checkability(t, the)
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Trivial"
  }
}
