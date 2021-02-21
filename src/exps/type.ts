import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Type extends Object implements Exp {
  kind = "Type"

  constructor() {
    super()
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.type
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
    return "Type"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Type"
  }
}
