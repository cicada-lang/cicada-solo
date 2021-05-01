import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Equal extends Core {
  t: Core
  from: Core
  to: Core

  constructor(t: Core, from: Core, to: Core) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  evaluate(env: Env): Value {
    return new Cores.EqualValue(
      evaluate(env, this.t),
      evaluate(env, this.from),
      evaluate(env, this.to)
    )
  }

  repr(): string {
    return `Equal(${this.t.repr()}, ${this.from.repr()}, ${this.to.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `Equal(${this.t.alpha_repr(ctx)}, ${this.from.alpha_repr(
      ctx
    )}, ${this.to.alpha_repr(ctx)})`
  }
}
