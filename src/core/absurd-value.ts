import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { TypeValue } from "../core"
import { Absurd } from "../core"

export class AbsurdValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Absurd()
    }
  }
}
