import { Exp } from "../exp"
import * as Value from "../value"
import { evaluate } from "../evaluate"
import * as Ctx from "../ctx"
import { check } from "../check"

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
    checkability: (t, { ctx }) => {
      const sigma = Value.is_sigma(ctx, t)
      const cdr_t = Value.Closure.apply(
        sigma.cdr_t_cl,
        evaluate(ctx.to_env(), car)
      )
      check(ctx, car, sigma.car_t)
      check(ctx, cdr, cdr_t)
    },
    repr: () => `cons(${car.repr()}, ${cdr.repr()})`,
    alpha_repr: (opts) =>
      `cons(${car.alpha_repr(opts)}, ${cdr.alpha_repr(opts)})`,
  }
}
