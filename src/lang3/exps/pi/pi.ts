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

export type Pi = Evaluable & {
  kind: "Exp.pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export function Pi(name: string, arg_t: Exp, ret_t: Exp): Pi {
  return {
    kind: "Exp.pi",
    name,
    arg_t,
    ret_t,
    evaluability: ({ mod, env, mode }) =>
      Value.pi(
        Evaluate.evaluate(mod, env, arg_t, { mode }),
        Value.Closure.create(mod, env, Pattern.v(name), ret_t)
      ),
  }
}
