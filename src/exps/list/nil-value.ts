import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class NilValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.ListValue) {
      return new Exps.NilCore()
    }
  }

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.NilValue) {
      return solution
    } else {
      return Solution.failure
    }
  }
}
