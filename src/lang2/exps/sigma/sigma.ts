import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { sigma_evaluable } from "./sigma-evaluable"

export type Sigma = Evaluable & {
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
    ...sigma_evaluable(name, car_t, cdr_t),
  }
}
