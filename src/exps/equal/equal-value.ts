import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { readback } from "../../readback"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { Equal } from "./equal"

export class EqualValue {
  t: Value
  from: Value
  to: Value

  constructor(t: Value, from: Value, to: Value) {
    this.t = t
    this.from = from
    this.to = to
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Equal(
        readback(ctx, new TypeValue(), this.t),
        readback(ctx, this.t, this.from),
        readback(ctx, this.t, this.to)
      )
    }
  }
}
