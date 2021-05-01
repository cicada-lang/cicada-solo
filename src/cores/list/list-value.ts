import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import * as Cores from "../../cores"

export class ListValue {
  elem_t: Value

  constructor(elem_t: Value) {
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.List(readback(ctx, new Cores.TypeValue(), this.elem_t))
    }
  }
}
