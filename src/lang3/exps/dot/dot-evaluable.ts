import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"

export const dot_evaluable = (target: Exp, name: string) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_dot(evaluator.evaluate(target, { mod, env, mode }), name),
  })
