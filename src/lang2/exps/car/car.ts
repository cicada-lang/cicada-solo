import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { car_evaluable } from "./car-evaluable"
import { Repr } from "../../repr"

export type Car = Evaluable &
  Repr & {
    kind: "Exp.car"
    target: Exp
  }

export function Car(target: Exp): Car {
  return {
    kind: "Exp.car",
    target,
    repr: () => `car(${target.repr()})`,
    ...car_evaluable(target),
  }
}
