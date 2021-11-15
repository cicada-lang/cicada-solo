import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { expect, Value } from "../../value"
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

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (that instanceof Exps.LiValue) {
      const list = expect(ctx, t, Exps.ListValue)
      return solution
        .unify(ctx, list.elem_t, this.head, that.head)
        .unify(ctx, list, this.tail, that.tail)
    } else {
      return Solution.failure
    }
  }
}
