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

  repr(): string {
    return `vec(${this.head.repr()}, ${this.tail.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `vec(${this.head.alpha_repr(ctx)}, ${this.tail.alpha_repr(ctx)})`
  }
}
