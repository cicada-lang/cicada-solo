import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { sigma_evaluable } from "./sigma-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Sigma = Evaluable &
  Repr & {
    kind: "Exp.sigma"
    name: string
    car_t: Exp
    cdr_t: Exp
  }

export function Sigma(name: string, car_t: Exp, cdr_t: Exp): Sigma {
  return {
    kind: "Exp.sigma",
    name,
    car_t,
    cdr_t,
    repr: () => `(${name}: ${repr(car_t)}) * ${repr(cdr_t)}`,
    ...sigma_evaluable(name, car_t, cdr_t),
  }
}
