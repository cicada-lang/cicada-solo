import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { TypeValue } from "../../core"
import { List } from "../../core"

export class ListValue {
  elem_t: Value

  constructor(elem_t: Value) {
    this.elem_t = elem_t
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    throw new Error("TODO")
  }
}
