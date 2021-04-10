import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { TypeValue } from "../../core"
import { Nat } from "../../core"

export class NatValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Nat()
    }
  }
}
