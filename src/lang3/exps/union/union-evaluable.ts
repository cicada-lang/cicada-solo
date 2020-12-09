import { Evaluable, EvaluationMode } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export const union_evaluable = (left: Exp, right: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.union(
        evaluator.evaluate(left, { mod, env, mode }),
        evaluator.evaluate(right, { mod, env, mode })
      ),
  })
