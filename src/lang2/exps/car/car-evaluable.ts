import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_car } from "../../evaluate"

export const car_evaluable = (target: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_car(evaluate(env, target)),
  })
