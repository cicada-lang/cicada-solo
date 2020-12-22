import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import * as Ctx from "../../ctx"
import * as Value from "../../value"
import { sigma_evaluable } from "./sigma-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Sigma = Exp & {
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
    ...Inferable({
      inferability: ({ ctx }) => {
        check(ctx, car_t, Value.type)
        const car_t_value = evaluate(Ctx.to_env(ctx), car_t)
        check(Ctx.extend(ctx, name, car_t_value), cdr_t, Value.type)
        return Value.type
      },
    }),
    repr: () => `(${name}: ${car_t.repr()}) * ${cdr_t.repr()}`,
    alpha_repr: (opts) => {
      const cdr_t_repr = cdr_t.alpha_repr({
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${car_t.alpha_repr(opts)}) * ${cdr_t_repr}`
    },
  }
}
