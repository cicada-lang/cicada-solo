import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import * as Value from "../value"
import { nat_to_number } from "./nat-util"
import { NatValue } from "../core"

export class Add1 implements Exp {
  prev: Exp

  constructor(prev: Exp) {
    this.prev = prev
  }

  evaluate(env: Env): Value.Value {
    return Value.add1(evaluate(env, this.prev))
  }

  infer(ctx: Ctx): Value.Value {
    check(ctx, this.prev, new NatValue())
    return new NatValue()
  }

  repr(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.repr()})`
    }
  }

  alpha_repr(ctx: AlphaCtx): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.alpha_repr(ctx)})`
    }
  }
}
