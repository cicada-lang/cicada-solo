import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { NatValue } from "../../cores"
import { Zero } from "../../cores"

export class ZeroValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof NatValue) {
      return new Zero()
    }
  }
}
