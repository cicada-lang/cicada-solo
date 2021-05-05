import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import * as Cores from "../../cores"

export class VectorValue {
  elem_t: Value
  length: Value

  constructor(elem_t: Value, length: Value) {
    this.elem_t = elem_t
    this.length = length
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.Vector(
        readback(ctx, new Cores.TypeValue(), this.elem_t),
        readback(ctx, new Cores.NatValue(), this.length)
      )
    }
  }
}
