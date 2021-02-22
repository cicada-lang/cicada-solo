import { Exp, AlphaReprOpts } from "../exp"

import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Value from "../value"
import { nat_to_number } from "../exp"

export class Add1 implements Exp {
  kind = "Add1"
  prev: Exp

  constructor(prev: Exp) {
    this.prev = prev
  }

  evaluate(env: Env): Value.Value {
    return Value.add1(evaluate(env, this.prev))
  }

  infer(ctx: Ctx): Value.Value {
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
