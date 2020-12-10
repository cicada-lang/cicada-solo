import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"

export function the_evaluable(t: Exp, exp: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      evaluator.evaluate(exp, { mod, env, mode }),
  })
}
