import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export function typecons_evaluable(
  name: string,
  t: Exp,
  sums: Array<{ tag: string; t: Exp }>
): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.typecons(
        name,
        evaluator.evaluate(t, { mod, env, mode }),
        Value.DelayedSums.create(sums, mod, env)
      ),
  })
}
