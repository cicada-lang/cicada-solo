import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import { NatValue } from "../../cores"
import { Add1 } from "../../cores"

export class Add1Value {
  prev: Value

  constructor(prev: Value) {
    this.prev = prev
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof NatValue) {
      return new Add1(readback(ctx, t, this.prev))
    }
  }
}
