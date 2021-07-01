import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class NilValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Sem.ListValue) {
      return new Sem.Nil()
    }
  }
}
