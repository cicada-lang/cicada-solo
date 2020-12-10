import { Fn } from "./fn"
import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Check from "../../check"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

import { Case } from "./case-fn"

export function case_fn_evaluable(cases: Array<Case>): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.case_fn(
        cases.map(({ pattern, ret }) =>
          Value.Closure.create(mod, env, pattern, ret)
        )
      ),
  })
}
