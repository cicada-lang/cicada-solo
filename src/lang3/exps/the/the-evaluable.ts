import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"

export const the_evaluable = (t: Exp, exp: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      evaluator.evaluate(exp, { mod, env, mode }),
  })
