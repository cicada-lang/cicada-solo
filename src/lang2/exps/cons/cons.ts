import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { cons_evaluable } from "./cons-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Cons = Evaluable &
  Repr &
  AlphaRepr & {
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
    alpha_repr: (opts) =>
      `cons(${car.alpha_repr(opts)}, ${cdr.alpha_repr(opts)})`,
  }
}
