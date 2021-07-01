import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Li extends Core {
  head: Core
  tail: Core

  constructor(head: Core, tail: Core) {
    super()
    this.head = head
    this.tail = tail
  }

  evaluate(env: Env): Value {
    return new Cores.LiValue(evaluate(env, this.head), evaluate(env, this.tail))
  }

  repr(): string {
    return `li(${this.head.repr()}, ${this.tail.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `li(${this.head.alpha_repr(ctx)}, ${this.tail.alpha_repr(ctx)})`
  }
}
