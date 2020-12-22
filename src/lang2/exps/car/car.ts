import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { infer } from "../../infer"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { car_evaluable } from "./car-evaluable"

export type Car = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.car"
    target: Exp
  }

export function Car(target: Exp): Car {
  return {
    kind: "Exp.car",
    target,
    ...car_evaluable(target),
    ...Inferable({
      inferability: ({ ctx }) => {
      const target_t = infer(ctx, target)
      const sigma = Value.is_sigma(ctx, target_t)
      return sigma.car_t
    },
    }),
    repr: () => `car(${target.repr()})`,
    alpha_repr: (opts) => `car(${target.alpha_repr(opts)})`,
  }
}
