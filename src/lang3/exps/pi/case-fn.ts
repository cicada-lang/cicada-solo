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
import { case_fn_evaluable } from "./case-fn-evaluable"

export type Case = {
  pattern: Pattern.Pattern
  ret: Exp
}

export type CaseFn = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.case_fn"
    cases: Array<Case>
  }

export function CaseFn(cases: Array<Case>): CaseFn {
  return {
    kind: "Exp.case_fn",
    cases,
    ...case_fn_evaluable(cases),
    repr: () => {
      let s = cases
        .map(
          ({ pattern, ret }) => `(${Pattern.repr(pattern)}) => ${ret.repr()}`
        )
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
    checkability: (t, { mod, ctx }) => {
      const pi = Value.is_pi(mod, ctx, t)
      for (const { pattern, ret } of cases) {
        Check.check(mod, ctx, Fn(pattern, ret), pi)
      }
    },
  }
}
