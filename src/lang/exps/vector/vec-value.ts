import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { expect, readback, Value } from "../../value"

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
    if (!(that instanceof Exps.VecValue)) {
      return Solution.failure
    }

    const vector = expect(ctx, t, Exps.VectorValue)
    return (
      solution
        .unify(ctx, vector.elem_t, this.head, that.head)
        // TODO the following type lenght is wrong.
        .unify(ctx, vector, this.tail, that.tail)
    )
  }
}
