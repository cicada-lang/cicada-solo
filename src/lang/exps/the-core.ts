import { AlphaCtx, Core, evaluate } from "../core"
import { Env } from "../env"
import { Value } from "../value"

export class TheCore extends Core {
  t: Core
  exp: Core

  constructor(t: Core, exp: Core) {
    super()
    this.t = t
    this.exp = exp
  }

  evaluate(env: Env): Value {
    return evaluate(env, this.exp)
  }

  format(): string {
    const args = [this.t.format(), this.exp.format()].join(", ")
    return `the(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [this.t.alpha_format(ctx), this.exp.alpha_format(ctx)].join(
      ", "
    )
    return `the(${args})`
  }
}
