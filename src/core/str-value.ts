import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TypeValue } from "./type-value"
import { Str } from "./str"

export class StrValue {
  kind: "Value.str" = "Value.str"

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Str()
    }
  }
}
