import { Exp, AlphaReprOpts } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Inferable } from "../inferable"
import * as Value from "../value"

export class Nat extends Object implements Exp {
  kind = "Nat"

  constructor() {
    super()
  }

  evaluability(the: { env: Env }): Value.Value {
    return Value.nat
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
    return "Nat"
  }

  alpha_repr(opts: AlphaReprOpts): string {
    return "Nat"
  }
}
