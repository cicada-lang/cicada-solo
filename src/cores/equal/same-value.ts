import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { EqualValue } from "../../cores"
import { Same } from "../../cores"

export class SameValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof EqualValue) {
      return new Same()
    }
  }
}
