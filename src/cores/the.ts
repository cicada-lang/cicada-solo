import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import { evaluate } from "../evaluate"

export class The extends Core {
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
    return `@the ${this.t.repr()} ${this.exp.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `@the ${this.t.alpha_repr(ctx)} ${this.exp.alpha_repr(ctx)}`
  }
}
