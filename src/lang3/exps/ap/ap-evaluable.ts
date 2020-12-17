import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"

export const ap_evaluable = (target: Exp, arg: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_ap(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(arg, { mod, env, mode })
      ),
  })
