import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class LiCore extends Core {
  head: Core
  tail: Core

  constructor(head: Core, tail: Core) {
    super()
    this.head = head
    this.tail = tail
  }

  evaluate(env: Env): Value {
    return new Exps.LiValue(evaluate(env, this.head), evaluate(env, this.tail))
  }

  format(): string {
    return `li(${this.head.format()}, ${this.tail.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `li(${this.head.alpha_format(ctx)}, ${this.tail.alpha_format(ctx)})`
  }
}
