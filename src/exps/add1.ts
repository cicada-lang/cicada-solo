import { Exp, AlphaReprOpts } from "../exp"
import { Inferable } from "../inferable"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Value from "../value"
import { nat_to_number } from "../exp"

export class Add1 extends Object implements Exp {
  kind = "Add1"
  prev: Exp

  constructor(prev: Exp) {
    super()
    this.prev = prev
  }

  evaluability({ env }: { env: Env }): Value.Value {
    return Value.add1(evaluate(env, this.prev))
  }

  checkability(t: Value.Value, the: { ctx: Ctx }): void {
    return Inferable({
      inferability: ({ ctx }: { ctx: Ctx }) => {
        check(ctx, this.prev, Value.nat)
        return Value.nat
      },
    }).checkability(t, the)
  }

  inferability({ ctx }: { ctx: Ctx }): Value.Value {
    check(ctx, this.prev, Value.nat)
    return Value.nat
  }

  repr(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.repr()})`
    }
  }

  alpha_repr(opts: AlphaReprOpts): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.alpha_repr(opts)})`
    }
  }
}
