import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { Value } from "../../value"
import { ListValue, LiValue } from "../../core"

export class Li implements Exp {
  head: Exp
  tail: Exp

  constructor(head: Exp, tail: Exp) {
    this.head = head
    this.tail = tail
  }

  evaluate(env: Env): Value {
    return new LiValue(evaluate(env, this.head), evaluate(env, this.tail))
  }

  infer(ctx: Ctx): Value {
    const elem_t = infer(ctx, this.head)
    check(ctx, this.tail, new ListValue(elem_t))
    return new ListValue(elem_t)
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `li(${this.head.alpha_repr(ctx)}, ${this.tail.alpha_repr(ctx)})`
  }
}
