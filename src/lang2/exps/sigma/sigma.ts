import { Exp } from "../../exp"

export type Sigma = {
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
  }
}
