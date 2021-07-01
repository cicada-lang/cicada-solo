import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class SoleValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    return new Sem.SoleCore()
  }
}
