import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import { TypeValue } from "../../cores"
import { List } from "../../cores"

export class ListValue {
  elem_t: Value

  constructor(elem_t: Value) {
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      return new List(readback(ctx, new TypeValue(), this.elem_t))
    }
  }
}
