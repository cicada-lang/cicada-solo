import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value } from "../../value"

export class QuoteValue extends Value {
  str: string

  constructor(str: string) {
    super()
    this.str = str
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.StrValue) {
      return new Exps.QuoteCore(this.str)
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.QuoteValue && that.str === this.str)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
  }
}
