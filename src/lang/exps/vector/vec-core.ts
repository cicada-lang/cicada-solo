import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class VecCore extends Core {
  head: Core
  tail: Core

  constructor(head: Core, tail: Core) {
    super()
    this.head = head
    this.tail = tail
  }

  evaluate(env: Env): Value {
    return new Exps.VecValue(evaluate(env, this.head), evaluate(env, this.tail))
  }

  format(): string {
    return `vec(${this.head.format()}, ${this.tail.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `vec(${this.head.alpha_format(ctx)}, ${this.tail.alpha_format(ctx)})`
  }
}
