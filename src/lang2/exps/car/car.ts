import { Exp } from "../../exp"

export type Car = {
  kind: "Exp.car"
  target: Exp
}

export function Car(target: Exp): Car {
  return {
    kind: "Exp.car",
    target,
  }
}
