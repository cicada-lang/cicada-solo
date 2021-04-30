import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { Nat } from "../../cores"

export class NatValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      return new Nat()
    }
  }
}
