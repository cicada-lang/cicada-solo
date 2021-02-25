import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TrivialValue } from "./trivial-value"
import { Sole } from "./sole"

export class SoleValue {
  kind: "Value.sole" = "Value.sole"

  readback(ctx: Ctx, t: Value): Exp | undefined {
    return new Sole()
  }
}
