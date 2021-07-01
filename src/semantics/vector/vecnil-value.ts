import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class VecnilValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.VectorValue) {
      return new Cores.Vecnil()
    }
  }
}
