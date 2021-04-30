import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { readback } from "../../readback"
import { TypeValue } from "../../exps"
import { List } from "../../exps"

export class ListValue {
  elem_t: Value

  constructor(elem_t: Value) {
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new List(readback(ctx, new TypeValue(), this.elem_t))
    }
  }
}
