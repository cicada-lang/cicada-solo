import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import * as Cores from "../cores"

export class TypeValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      return new Cores.Type()
    }
  }
}
