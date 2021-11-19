import { Core, AlphaCtx } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import * as Exps from "../exps"
import { QuoteCore, TodoNeutral } from "../exps"

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
