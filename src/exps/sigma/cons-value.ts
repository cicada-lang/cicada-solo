import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"

export class ConsValue {
  car: Value
  cdr: Value

  constructor(car: Value, cdr: Value) {
    this.car = car
    this.cdr = cdr
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
