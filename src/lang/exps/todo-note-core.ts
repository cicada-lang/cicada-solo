import * as Exps from "."
import { QuoteCore, TodoNoteNeutral } from "."
import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import { Value } from "../value"

export class TodoNoteCore extends Core {
  note: string
  t: Value

  constructor(note: string, type: Value) {
    super()
    this.note = note
    this.t = type
  }

  evaluate(env: Env): Value {
    return new Exps.NotYetValue(this.t, new TodoNoteNeutral(this.note, this.t))
  }

  format(): string {
    return `TODO_NOTE(${new QuoteCore(this.note).format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return this.format()
  }
}
