import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export type Equal = Evaluable & {
  kind: "Exp.equal"
  t: Exp
  from: Exp
  to: Exp
}

export function Equal(t: Exp, from: Exp, to: Exp): Equal {
  return {
    kind: "Exp.equal",
    t,
    from,
    to,
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.equal(
        evaluator.evaluate(t, { mod, env, mode }),
        evaluator.evaluate(from, { mod, env, mode }),
        evaluator.evaluate(to, { mod, env, mode })
      ),
  }
}
