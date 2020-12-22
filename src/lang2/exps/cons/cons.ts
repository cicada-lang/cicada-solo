import { Exp } from "../../exp"
import { cons_evaluable } from "./cons-evaluable"
import { cons_checkable } from "./cons-checkable"

export type Cons = Exp & {
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
    ...cons_checkable(car, cdr),
    repr: () => `cons(${car.repr()}, ${cdr.repr()})`,
    alpha_repr: (opts) =>
      `cons(${car.alpha_repr(opts)}, ${cdr.alpha_repr(opts)})`,
  }
}
