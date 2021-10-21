import { Neutral } from "../neutral"
import { Ctx } from "../ctx"
import { Core } from "../core"
import { TodoCore } from "./todo-core"
import { Value } from "../value"

export class TodoNeutral extends Neutral {
  note: string
  t: Value

  constructor(note: string, type: Value) {
    super()
    this.note = note
    this.t = type
  }

  readback_neutral(ctx: Ctx): Core {
    return new TodoCore(this.note, this.t)
  }
}
