import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Value } from "../../value"
import { nat_to_number } from "./nat-util"
import { NatValue, Add1Value } from "../../cores"

export class Add1 extends Exp {
  prev: Exp

  constructor(prev: Exp) {
    super()
    this.prev = prev
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new Add1Value(evaluate(ctx, env, this.prev))
  }

  infer(ctx: Ctx): Value {
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
}
