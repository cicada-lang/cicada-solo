import { Evaluable, EvaluationMode } from "../evaluable"
import { Exp } from "../exp"
import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Trace from "../../trace"

export type The = Evaluable & {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export function The(t: Exp, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    evaluability: ({ mod, env, mode, evaluator }) =>
      evaluator.evaluate(exp, { mod, env, mode }),
  }
}
