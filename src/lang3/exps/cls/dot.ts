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

export type Dot = Evaluable & {
  kind: "Exp.dot"
  target: Exp
  name: string
}

export function Dot(target: Exp, name: string): Dot {
  return {
    kind: "Exp.dot",
    target,
    name,
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_dot(evaluator.evaluate(target, { mod, env, mode }), name),
  }
}
