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

  format(): string {
    const args = [this.left_t.format(), this.right_t.format()].join(", ")

    return `Either(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [
      this.left_t.alpha_format(ctx),
      this.right_t.alpha_format(ctx),
    ].join(", ")

    return `Either(${args})`
  }
}
