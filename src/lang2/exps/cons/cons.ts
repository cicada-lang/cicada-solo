import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { cons_evaluable } from "./cons-evaluable"

export type Cons = Evaluable & {
  kind: "Exp.cons"
  car: Exp
  cdr: Exp
}

export function Cons(car: Exp, cdr: Exp): Cons {
  return {
    kind: "Exp.cons",
    car,
    cdr,
    ...cons_evaluable(car, cdr),
  }
}
