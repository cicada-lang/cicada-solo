import { Ctx } from "../ctx"
import { Exp } from "../exp"
import * as Value from "../value"

export class AbsurdValue {
  readback(ctx: Ctx, t: Value.Value): Exp | undefined {
    throw new Error("TODO")
    // if (t instanceof TypeValue) {
    //   return new Absurd()
    // }
  }
}
