import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { Absurd } from "../../cores"

export class AbsurdValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      return new Absurd()
    }
  }
}
