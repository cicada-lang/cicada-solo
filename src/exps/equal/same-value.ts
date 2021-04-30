import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { EqualValue } from "../../exps"
import { Same } from "../../exps"

export class SameValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof EqualValue) {
      return new Same()
    }
  }
}
