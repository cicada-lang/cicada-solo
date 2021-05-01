import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class ZeroValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.NatValue) {
      return new Cores.Zero()
    }
  }
}
