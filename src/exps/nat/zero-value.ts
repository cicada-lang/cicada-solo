import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { NatValue } from "../../cores"
import { Zero } from "./zero"

export class ZeroValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof NatValue) {
      return new Zero()
    }
  }
}
