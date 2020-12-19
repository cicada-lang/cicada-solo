import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const add1_evaluable = (prev: Exp) =>
  Evaluable({
    evaluability: ({ env }) => Value.add1(evaluate(env, prev)),
  })
