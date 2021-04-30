import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { TypeValue } from "../../exps"
import { Str } from "../../exps"

export class StrValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Str()
    }
  }
}
