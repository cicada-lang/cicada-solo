import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class InlCore extends Core {
  left: Core

  constructor(left: Core) {
    super()
    this.left = left
  }

  evaluate(env: Env): Value {
    return new Exps.InlValue(evaluate(env, this.left))
  }

  repr(): string {
    const args = [this.left.repr()].join(", ")

    return `inl(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [this.left.alpha_repr(ctx)].join(", ")

    return `inl(${args})`
  }
}
