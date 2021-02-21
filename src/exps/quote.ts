import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Quote extends Object implements Exp {
  kind = "Quote"
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.quote(this.str)
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        return Value.str
      },
    }).checkability(t, the)
  }

  inferability(the: { ctx: Ctx }): Value.Value {
    return Value.str
  }

  repr(): string {
    return `"${this.str}"`
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return `"${this.str}"`
  }
}
