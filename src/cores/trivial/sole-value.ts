import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Sole } from "../../cores"

export class SoleValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Sole()
  }
}
