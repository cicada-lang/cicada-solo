import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import { Add1Value } from "../../exps/add1-value"

export const add1_evaluable = (prev: Exp) =>
  Evaluable({
    evaluability: ({ env }) => Add1Value(evaluate(env, prev)),
  })
