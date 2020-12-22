import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Ctx from "../../ctx"
import { Checkable } from "../../checkable"
import { check } from "../../check"
import { evaluate } from "../../evaluate"

export const cons_checkable = (car: Exp, cdr: Exp) =>
  Checkable({
    checkability: (t, { ctx }) => {
      const sigma = Value.is_sigma(ctx, t)
      const cdr_t = Value.Closure.apply(
        sigma.cdr_t_cl,
        evaluate(Ctx.to_env(ctx), car)
      )
      check(ctx, car, sigma.car_t)
      check(ctx, cdr, cdr_t)
    },
  })
