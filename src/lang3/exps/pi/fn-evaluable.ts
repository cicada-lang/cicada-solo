import { Var } from "../var"
import { evaluator } from "../../evaluator"
import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Check from "../../check"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Ctx from "../../ctx"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export function fn_evaluable(pattern: Pattern.Pattern, ret: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.fn(Value.Closure.create(mod, env, pattern, ret)),
  })
}
