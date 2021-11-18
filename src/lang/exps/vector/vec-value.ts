import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { expect, Value } from "../../value"
import { Solution } from "../../solution"
import { readback } from "../../value"
import * as Exps from "../../exps"

export class VecValue extends Value {
  head: Value
  tail: Value

  constructor(head: Value, tail: Value) {
    super()
    this.head = head
    this.tail = tail
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.VectorValue) {
      return new Exps.VecCore(
        readback(ctx, t.elem_t, this.head),
        readback(ctx, t, this.tail)
      )
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (that instanceof Exps.VecValue) {
      const vector = expect(ctx, t, Exps.VectorValue)
      return (
        solution
          .unify(ctx, vector.elem_t, this.head, that.head)
          // TODO the following type lenght is wrong.
          .unify(ctx, vector, this.tail, that.tail)
      )
    } else {
      return Solution.failure
    }
  }
}
