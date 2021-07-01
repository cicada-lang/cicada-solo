import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import { evaluate } from "../core"

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

  repr(): string {
    const args = [this.t.repr(), this.exp.repr()].join(", ")
    return `the(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [this.t.alpha_repr(ctx), this.exp.alpha_repr(ctx)].join(", ")
    return `the(${args})`
  }
}
