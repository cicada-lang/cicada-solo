import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { readback } from "../readback"
import { NatValue } from "./nat-value"
import { Add1 } from "./add1"

export class Add1Value {
  kind: "Value.add1" = "Value.add1"
  prev: Value

  constructor(prev: Value) {
    this.prev = prev
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof NatValue) {
      return new Add1(readback(ctx, t, this.prev))
    }
  }
}
