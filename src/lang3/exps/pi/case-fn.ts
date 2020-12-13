import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable, non_inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import * as Pattern from "../../pattern"
import * as ut from "../../../ut"
import { case_fn_evaluable } from "./case-fn-evaluable"
import { case_fn_checkable } from "./case-fn-checkable"
import { Fn } from "./fn"

export type Case = {
  pattern: Pattern.Pattern
  ret: Exp
}

export type CaseFn = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.case_fn"
    cases: Array<Case>
  }

export function CaseFn(cases: Array<Case>): CaseFn {
  return {
    kind: "Exp.case_fn",
    cases,
    ...case_fn_evaluable(cases),
    ...case_fn_checkable(cases),
    ...non_inferable,
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
