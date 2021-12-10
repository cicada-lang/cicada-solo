import { Core } from "../core"
import { Ctx } from "../ctx"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import { Value } from "../value"
import { TodoNoteCore } from "./todo-note-core"

export class TodoNoteNeutral extends Neutral {
  note: string
  t: Value

  constructor(note: string, type: Value) {
    super()
    this.note = note
    this.t = type
  }

  readback_neutral(ctx: Ctx): Core {
    return new TodoNoteCore(this.note, this.t)
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof TodoNoteNeutral)) {
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
    }

    return solution.unify_type(ctx, this.t, that.t)
  }
}
