import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { evaluate } from "../../core"
import * as Cores from "../../cores"

export class Inr extends Core {
  right: Core

  constructor(right: Core) {
    super()
    this.right = right
  }

  evaluate(env: Env): Value {
    return new Cores.InrValue(evaluate(env, this.right))
  }

  repr(): string {
    const args = [this.right.repr()].join(", ")

    return `inr(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [this.right.alpha_repr(ctx)].join(", ")

    return `inr(${args})`
  }
}
