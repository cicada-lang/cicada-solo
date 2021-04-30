import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { Type } from "../cores"

export class TypeValue {
  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      return new Type()
    }
  }
}
