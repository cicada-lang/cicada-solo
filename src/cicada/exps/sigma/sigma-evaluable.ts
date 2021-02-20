import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { evaluate } from "../../evaluate"

export const sigma_evaluable = (name: string, car_t: Exp, cdr_t: Exp) =>
  Evaluable({
    evaluability: ({ env }) =>
      Value.sigma(evaluate(env, car_t), Value.Closure.create(env, name, cdr_t)),
  })
