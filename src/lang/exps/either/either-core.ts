import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class EitherCore extends Core {
  left_t: Core
  right_t: Core

  constructor(left_t: Core, right_t: Core) {
    super()
    this.left_t = left_t
    this.right_t = right_t
  }

  evaluate(env: Env): Value {
    return new Exps.EitherValue(
      evaluate(env, this.left_t),
      evaluate(env, this.right_t)
    )
  }

  repr(): string {
    const args = [this.left_t.repr(), this.right_t.repr()].join(", ")

    return `Either(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.left_t.alpha_repr(ctx),
      this.right_t.alpha_repr(ctx),
    ].join(", ")

    return `Either(${args})`
  }
}
