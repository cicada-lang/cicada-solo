import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { sigma_evaluable } from "./sigma-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Sigma = Evaluable &
  Repr &
  AlphaRepr & {
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
    repr: () => `(${name}: ${car_t.repr()}) * ${cdr_t.repr()}`,
    alpha_repr: (opts) => {
      const cdr_t_repr = cdr_t.alpha_repr({
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${name}: ${car_t.alpha_repr(opts)}) * ${cdr_t_repr}`
    },
  }
}
