import { Evaluable, EvaluationMode } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export function the_evaluable(t: Exp, exp: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      evaluator.evaluate(exp, { mod, env, mode }),
  })
}
