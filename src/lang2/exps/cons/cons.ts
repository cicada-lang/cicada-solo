import { Exp } from "../../exp"

export type Cons = {
  kind: "Exp.cons"
  car: Exp
  cdr: Exp
}

export function Cons(car: Exp, cdr: Exp): Cons {
  return {
    kind: "Exp.cons",
    car,
    cdr,
  }
}
