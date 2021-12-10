import { AlphaCtx, Core, evaluate } from "../core"
import { Env } from "../env"
import { Value } from "../value"

export class TheCore extends Core {
  t: Core
  x: Core

  constructor(t: Core, x: Core) {
    super()
    this.t = t
    this.x = x
  }

  evaluate(env: Env): Value {
    return evaluate(env, this.x)
  }

  format(): string {
    const t = this.t.format()
    const x = this.x.format()
    const args = [t, x].join(", ")

    return `the(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const t = this.t.alpha_format(ctx)
    const x = this.x.alpha_format(ctx)
    const args = [t, x].join(", ")

    return `the(${args})`
  }
}
