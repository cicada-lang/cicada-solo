import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { Sole } from "../core"

export class SoleValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    return new Sole()
  }
}
