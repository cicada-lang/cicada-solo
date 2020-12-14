import { Exp } from "../../exp"
import * as Pattern from "../../pattern"
import * as ut from "../../../ut"
import { case_fn_evaluable } from "./case-fn-evaluable"
import { case_fn_checkable } from "./case-fn-checkable"
import { Fn } from "./fn"

export type CaseFn = Exp & {
  kind: "Exp.case_fn"
  cases: Array<Case>
}

export type Case = {
  pattern: Pattern.Pattern
  ret: Exp
}

export function CaseFn(cases: Array<Case>): CaseFn {
  return {
    kind: "Exp.case_fn",
    cases,
    ...case_fn_evaluable(cases),
    ...case_fn_checkable(cases),
    repr: () => {
      let s = cases
        .map(
          ({ pattern, ret }) => `(${Pattern.repr(pattern)}) => ${ret.repr()}`
        )
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
    alpha_repr: (opts) => {
      const s = cases
        .map(({ pattern, ret }) => Fn(pattern, ret).alpha_repr(opts))
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
