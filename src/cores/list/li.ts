import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { Value } from "../../value"
import { ListValue, LiValue } from "../../cores"

export class Li implements Core {
  head: Core
  tail: Core

  constructor(head: Core, tail: Core) {
    this.head = head
    this.tail = tail
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new LiValue(
      evaluate(ctx, env, this.head),
      evaluate(ctx, env, this.tail)
    )
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `li(${this.head.alpha_repr(ctx)}, ${this.tail.alpha_repr(ctx)})`
  }
}
