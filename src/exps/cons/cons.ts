import { Exp } from "../../exp"
import * as Value from "../../value"
import { evaluate } from "../../evaluate"
import { cons_checkable } from "./cons-checkable"

export type Cons = Exp & {
  kind: "Cons"
  car: Exp
  cdr: Exp
}

export function Cons(car: Exp, cdr: Exp): Cons {
  return {
    kind: "Cons",
    car,
    cdr,
    evaluability: ({ env }) =>
      Value.cons(evaluate(env, car), evaluate(env, cdr)),
    ...cons_checkable(car, cdr),
    repr: () => `cons(${car.repr()}, ${cdr.repr()})`,
    alpha_repr: (opts) =>
      `cons(${car.alpha_repr(opts)}, ${cdr.alpha_repr(opts)})`,
  }
}
