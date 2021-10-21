import { Core } from "../core"
import { Neutral } from "../neutral"
import { Ctx } from "../ctx"
import { Solution } from "../solution"
import * as Exps from "../exps"

export class VarNeutral extends Neutral {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.VarCore(this.name)
  }

  unify(solution: Solution, that: Neutral): Solution {
    if (that instanceof VarNeutral && this.name === that.name) {
      return solution
    } else {
      return Solution.failure
    }
  }
}
