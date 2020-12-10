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

export function replace_evaluable(
  target: Exp,
  motive: Exp,
  base: Exp
): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_replace(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(motive, { mod, env, mode }),
        evaluator.evaluate(base, { mod, env, mode })
      ),
  })
}
