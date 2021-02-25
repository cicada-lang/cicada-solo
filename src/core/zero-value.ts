import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { NatValue } from "./nat-value"
import { Zero } from "./zero"

export class ZeroValue {
  kind: "Value.zero" = "Value.zero"

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof NatValue) {
      return new Zero()
    }
  }
}
