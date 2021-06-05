import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class Inl extends Core {
  left: Core

  constructor(left: Core) {
    super()
    this.left = left
  }

  evaluate(env: Env): Value {
    return new Cores.InlValue(evaluate(env, this.left))
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