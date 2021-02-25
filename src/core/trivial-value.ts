import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TypeValue } from "./type-value"
import { Trivial } from "./trivial"

export class TrivialValue {
  kind: "Value.trivial" = "Value.trivial"

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Trivial()
    }
  }
}
