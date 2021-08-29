import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"

export class ConsValue extends Value {
  car: Value
  cdr: Value

  constructor(car: Value, cdr: Value) {
    super()
    this.car = car
    this.cdr = cdr
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
