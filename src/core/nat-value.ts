import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TypeValue } from "./type-value"
import { Nat } from "./nat"

export class NatValue {
  kind: "Value.nat" = "Value.nat"

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Nat()
    }
  }
}
