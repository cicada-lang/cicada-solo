import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../value"
import * as Cores from "../../cores"

export class ListValue extends Value {
  elem_t: Value

  constructor(elem_t: Value) {
    super()
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.List(readback(ctx, new Cores.TypeValue(), this.elem_t))
    }
  }
}
