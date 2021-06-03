import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import * as Cores from "../../cores"

export class Add1Value extends Value {
  prev: Value

  constructor(prev: Value) {
    super()
    this.prev = prev
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.NatValue) {
      return new Cores.Add1(readback(ctx, t, this.prev))
    }
  }
}
