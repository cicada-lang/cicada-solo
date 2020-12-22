import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { car_evaluable } from "./car-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Car = Evaluable &
  Repr & AlphaRepr & {
    kind: "Exp.car"
    target: Exp
  }

export function Car(target: Exp): Car {
  return {
    kind: "Exp.car",
    target,
    ...car_evaluable(target),
    repr: () => `car(${target.repr()})`,
    alpha_repr: (opts) => `car(${target.alpha_repr(opts)})`,
  }
}
