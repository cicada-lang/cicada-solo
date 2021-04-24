import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
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

  check(ctx: Ctx, t: Value): void {
    throw new Error("TODO")
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
