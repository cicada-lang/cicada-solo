import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export function absurd_ind_evaluable(target: Exp, motive: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_absurd_ind(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(motive, { mod, env, mode })
      ),
  })
}
