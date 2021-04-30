import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { Str } from "../../cores"

export class StrValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      return new Str()
    }
  }
}
