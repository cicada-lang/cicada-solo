import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import * as Exps from "../exps"
import { Value } from "../value"

export class TodoCore extends Core {
  t: Value

  constructor(t: Value) {
    super()
    this.t = t
  }

  evaluate(env: Env): Value {
    return new Exps.NotYetValue(this.t, new Exps.TodoNeutral(this.t))
  }

  format(): string {
    return `TODO`
  }

  alpha_format(ctx: AlphaCtx): string {
    return this.format()
  }
}
