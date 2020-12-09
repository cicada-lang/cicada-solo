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

export const pi_evaluable = (name: string, arg_t: Exp, ret_t: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Value.pi(
        evaluator.evaluate(arg_t, { mod, env, mode }),
        Value.Closure.create(mod, env, Pattern.v(name), ret_t)
      ),
  })
