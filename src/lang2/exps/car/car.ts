import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { car_evaluable } from "./car-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Car = Evaluable &
  Repr & {
    kind: "Exp.car"
    target: Exp
  }

export function Car(target: Exp): Car {
  return {
    kind: "Exp.car",
    target,
    repr: () => `car(${repr(target)})`,
    ...car_evaluable(target),
  }
}
