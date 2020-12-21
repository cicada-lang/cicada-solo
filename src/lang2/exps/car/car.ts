import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { car_evaluable } from "./car-evaluable"

export type Car = Evaluable & {
  kind: "Exp.car"
  target: Exp
}

export function Car(target: Exp): Car {
  return {
    kind: "Exp.car",
    target,
    ...car_evaluable(target),
  }
}
