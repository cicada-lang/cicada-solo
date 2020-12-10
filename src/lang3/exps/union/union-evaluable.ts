import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const union_evaluable = (left: Exp, right: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.union(
        evaluator.evaluate(left, { mod, env, mode }),
        evaluator.evaluate(right, { mod, env, mode })
      ),
  })
