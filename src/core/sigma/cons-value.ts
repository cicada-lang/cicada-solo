import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"

export class ConsValue {
  car: Value
  cdr: Value

  constructor(car: Value, cdr: Value) {
    this.car = car
    this.cdr = cdr
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // NOTE eta expand
    return undefined
  }
}
