import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { TypeValue } from "../../exps"
import { Nat } from "../../exps"

export class NatValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Nat()
    }
  }
}
