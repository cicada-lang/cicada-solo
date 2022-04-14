import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Neutral } from "../../neutral"
import { Solution } from "../../solution"

export class VarNeutral extends Neutral {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.VarCore(this.name)
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof VarNeutral && this.name === that.name)) {
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
    }

    return solution
  }
}
