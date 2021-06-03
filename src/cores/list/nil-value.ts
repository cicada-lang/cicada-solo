import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class NilValue   extends Value{
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.ListValue) {
      return new Cores.Nil()
    }
  }
}
