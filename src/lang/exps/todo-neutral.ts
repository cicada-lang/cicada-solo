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

  unify(solution: Solution, that: Neutral): Solution {
    if (that instanceof TodoNeutral) {
      return solution.unify(this.t, that.t)
    } else {
      return Solution.failure
    }
  }
}
