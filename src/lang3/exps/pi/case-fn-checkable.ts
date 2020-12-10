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

export function case_fn_checkable(cases: Array<Case>): Checkable {
  return Checkable({
    checkability: (t, { mod, ctx }) => {
      const pi = Value.is_pi(mod, ctx, t)
      for (const { pattern, ret } of cases) {
        Check.check(mod, ctx, Fn(pattern, ret), pi)
      }
    },
  })
}
