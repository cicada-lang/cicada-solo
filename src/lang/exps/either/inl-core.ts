import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class InlCore extends Core {
  left: Core

  constructor(left: Core) {
    super()
    this.left = left
  }

  evaluate(env: Env): Value {
    return new Exps.InlValue(evaluate(env, this.left))
  }

  format(): string {
    const args = [this.left.format()].join(", ")

    return `inl(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [this.left.alpha_format(ctx)].join(", ")

    return `inl(${args})`
  }
}
