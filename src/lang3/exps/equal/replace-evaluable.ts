import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"

export const replace_evaluable = (target: Exp, motive: Exp, base: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_replace(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(motive, { mod, env, mode }),
        evaluator.evaluate(base, { mod, env, mode })
      ),
  })
