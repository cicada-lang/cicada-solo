import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import { Type } from "../cores"

export class TypeValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      return new Type()
    }
  }
}
