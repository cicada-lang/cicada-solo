import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class InrCore extends Core {
  right: Core

  constructor(right: Core) {
    super()
    this.right = right
  }

  evaluate(env: Env): Value {
    return new Exps.InrValue(evaluate(env, this.right))
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
