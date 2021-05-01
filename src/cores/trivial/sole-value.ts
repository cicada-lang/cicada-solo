import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class SoleValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Cores.Sole()
  }
}
