import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value } from "../../value"

export abstract class BuiltInValue extends Value {
  name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Exps.BuiltInCore(this.name)
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.BuiltInValue && this.name === that.name)) {
      return Solution.fail_to_be_the_same_value(ctx, t, this, that)
    }

    return solution
  }
}
