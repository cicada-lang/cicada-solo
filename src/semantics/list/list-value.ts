import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Sem from "../../sem"

export class ListValue extends Value {
  elem_t: Value

  constructor(elem_t: Value) {
    super()
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.TypeValue) {
      return new Sem.List(readback(ctx, new Sem.TypeValue(), this.elem_t))
    }
  }
}
