import { Neutral } from "../neutral"
import { Solution } from "../solution"
import { Ctx } from "../ctx"
import { Core } from "../core"
import * as Exps from "../exps"
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

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof TodoNeutral)) {
      return Solution.failure
    }

    return solution.unify_type(ctx, this.t, that.t)
  }
}
