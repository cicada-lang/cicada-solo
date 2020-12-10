import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"

export function ap_evaluable(target: Exp, arg: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_ap(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(arg, { mod, env, mode })
      ),
  })
}
