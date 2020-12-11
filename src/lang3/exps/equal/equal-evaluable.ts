import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const equal_evaluable = (t: Exp, from: Exp, to: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.equal(
        evaluator.evaluate(t, { mod, env, mode }),
        evaluator.evaluate(from, { mod, env, mode }),
        evaluator.evaluate(to, { mod, env, mode })
      ),
  })
