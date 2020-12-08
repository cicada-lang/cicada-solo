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

export type Replace = Evaluable & {
  kind: "Exp.replace"
  target: Exp
  motive: Exp
  base: Exp
}

export function Replace(target: Exp, motive: Exp, base: Exp): Replace {
  return {
    kind: "Exp.replace",
    target,
    motive,
    base,
    evaluability: ({ mod, env, mode }) =>
      Evaluate.do_replace(
        Evaluate.evaluate(mod, env, target, { mode }),
        Evaluate.evaluate(mod, env, motive, { mode }),
        Evaluate.evaluate(mod, env, base, { mode })
      ),
  }
}
