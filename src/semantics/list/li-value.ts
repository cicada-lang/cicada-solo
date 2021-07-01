import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Sem from "../../sem"

export class LiValue extends Value {
  head: Value
  tail: Value

  constructor(head: Value, tail: Value) {
    super()
    this.head = head
    this.tail = tail
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.ListValue) {
      return new Sem.LiCore(
        readback(ctx, t.elem_t, this.head),
        readback(ctx, t, this.tail)
      )
    }
  }
}
