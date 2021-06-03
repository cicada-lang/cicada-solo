import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class SoleValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Cores.Sole()
  }
}
