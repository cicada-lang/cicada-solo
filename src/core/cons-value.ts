import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { readback } from "../readback"
import { SigmaValue } from "./sigma-value"
import { Cons } from "./cons"

export class ConsValue {
  car: Value
  cdr: Value

  constructor(car: Value, cdr: Value) {
    this.car = car
    this.cdr = cdr
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    // TODO
    return undefined
  }
}
