import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import { infer } from "../../infer"
import * as Value from "../../value"
import { car_evaluable } from "./car-evaluable"

export type Car = Exp & {
  kind: "Car"
  target: Exp
}

export function Car(target: Exp): Car {
  return {
    kind: "Car",
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
