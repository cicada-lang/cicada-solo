import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import { ListValue, Li } from "../../cores"

export class LiValue {
  head: Value
  tail: Value

  constructor(head: Value, tail: Value) {
    this.head = head
    this.tail = tail
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof ListValue) {
      return new Li(
        readback(ctx, t.elem_t, this.head),
        readback(ctx, t, this.tail)
      )
    }
  }
}
