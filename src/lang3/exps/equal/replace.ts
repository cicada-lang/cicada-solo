import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp, repr } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export type Replace = Evaluable &
  Repr & {
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
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_replace(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(motive, { mod, env, mode }),
        evaluator.evaluate(base, { mod, env, mode })
      ),
    repr: () => `replace(${repr(target)}, ${repr(motive)}, ${repr(base)})`,
  }
}
