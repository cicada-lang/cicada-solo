import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Sem from "../../sem"

export class VectorValue extends Value {
  elem_t: Value
  length: Value

  constructor(elem_t: Value, length: Value) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      return new Sem.Vector(
        readback(ctx, new Sem.TypeValue(), this.elem_t),
        readback(ctx, new Sem.NatValue(), this.length)
      )
    }
  }
}
