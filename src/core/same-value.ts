import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { EqualValue } from "./equal-value"
import { Same } from "./same"

export class SameValue {
  kind: "Value.same" = "Value.same"

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof EqualValue) {
      return new Same()
    }
  }
}
