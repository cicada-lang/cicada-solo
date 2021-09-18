import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class LiValue extends Value {
  head: Value
  tail: Value

  constructor(head: Value, tail: Value) {
    super()
    this.head = head
    this.tail = tail
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.ListValue) {
      return new Exps.LiCore(
        readback(ctx, t.elem_t, this.head),
        readback(ctx, t, this.tail)
      )
    }
  }

  unify(solution: Solution, that: Value): Solution {
    if (that instanceof Exps.LiValue) {
      return solution.unify(this.head, that.head).unify(this.tail, that.tail)
    } else {
      return Solution.failure
    }
  }
}
