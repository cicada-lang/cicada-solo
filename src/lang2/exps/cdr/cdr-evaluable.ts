import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_cdr } from "../../evaluate"

export const cdr_evaluable = (target: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_cdr(evaluate(env, target)),
  })
