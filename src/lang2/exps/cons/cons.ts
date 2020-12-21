import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { cons_evaluable } from "./cons-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Cons = Evaluable &
  Repr & {
    kind: "Exp.cons"
    car: Exp
    cdr: Exp
  }

export function Cons(car: Exp, cdr: Exp): Cons {
  return {
    kind: "Exp.cons",
    car,
    cdr,
    repr: () => `cons(${repr(car)}, ${repr(cdr)})`,
    ...cons_evaluable(car, cdr),
  }
}
