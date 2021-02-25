import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Value } from "../value"
import { readback } from "../readback"
import { SigmaValue } from "./sigma-value"
import { Cons } from "./cons"

export class ConsValue {
  kind: "Value.cons" = "Value.cons"
  car: Value
  cdr: Value

  constructor(car: Value, cdr: Value) {
    this.car = car
    this.cdr = cdr
  }
}
