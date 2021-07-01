import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { readback } from "../value"

export class Normal {
  t: Value
  value: Value

  constructor(t: Value, value: Value) {
    this.t = t
    this.value = value
  }

  readback_normal(ctx: Ctx): Core {
    return readback(ctx, this.t, this.value)
  }
}
