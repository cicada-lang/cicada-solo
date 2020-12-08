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
import * as ut from "../../../ut"

export type Case = {
  pattern: Pattern.Pattern
  ret: Exp
}

export type CaseFn = Evaluable &
  Repr & {
    kind: "Exp.case_fn"
    cases: Array<Case>
  }

export function CaseFn(cases: Array<Case>): CaseFn {
  return {
    kind: "Exp.case_fn",
    cases,
    evaluability: ({ mod, env, mode }) =>
      Value.case_fn(
        cases.map(({ pattern, ret }) =>
          Value.Closure.create(mod, env, pattern, ret)
        )
      ),
    repr: () => {
      let s = cases
        .map(({ pattern, ret }) => `(${Pattern.repr(pattern)}) => ${repr(ret)}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
