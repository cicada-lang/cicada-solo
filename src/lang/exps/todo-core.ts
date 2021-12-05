import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import * as Exps from "../exps"
import { QuoteCore, TodoNeutral } from "../exps"
import { Value } from "../value"

export class TodoCore extends Core {
  note: string
  t: Value

  constructor(note: string, type: Value) {
    super()
    this.note = note
    this.t = type
  }

  evaluate(env: Env): Value {
    return new Exps.NotYetValue(this.t, new TodoNeutral(this.note, this.t))
  }

  format(): string {
    return `@TODO ${new QuoteCore(this.note).format()}`
  }

  alpha_format(ctx: AlphaCtx): string {
    return this.format()
  }
}
