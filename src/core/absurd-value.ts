import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TypeValue } from "./type-value"
import { Absurd } from "./absurd"

export class AbsurdValue {
  kind: "Value.absurd" = "Value.absurd" 

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Absurd()
    }
  }
}
