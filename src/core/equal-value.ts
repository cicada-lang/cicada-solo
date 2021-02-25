import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { readback } from "../readback"
import * as Value from "../value"
import { TypeValue } from "./type-value"
import { Equal } from "./equal"

export class EqualValue {
  t: Value.Value
  from: Value.Value
  to: Value.Value

  constructor(t: Value.Value, from: Value.Value, to: Value.Value) {
    this.t = t
    this.from = from
    this.to = to
  }

  readback(ctx: Ctx, t: Value.Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Equal(
        readback(ctx, Value.type, this.t),
        readback(ctx, this.t, this.from),
        readback(ctx, this.t, this.to)
      )
    }
  }
}
