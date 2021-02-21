import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"

export const cons_evaluable = (car: Exp, cdr: Exp) =>
  Evaluable({
    evaluability: ({ env }) =>
      Value.cons(evaluate(env, car), evaluate(env, cdr)),
  })
