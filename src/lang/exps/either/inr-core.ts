import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class InrCore extends Core {
  right: Core

  constructor(right: Core) {
    super()
    this.right = right
  }

  evaluate(env: Env): Value {
    return new Exps.InrValue(evaluate(env, this.right))
  }

  format(): string {
    const args = [this.right.format()].join(", ")

    return `inr(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [this.right.alpha_format(ctx)].join(", ")

    return `inr(${args})`
  }
}
