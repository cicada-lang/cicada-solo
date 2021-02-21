import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Zero extends Object implements Exp {
  kind = "Zero"

  constructor() {
    super()
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.zero
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        return Value.nat
      },
    }).checkability(t, the)
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.nat
  }

  repr(): string {
    return "0"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "0"
  }
}
