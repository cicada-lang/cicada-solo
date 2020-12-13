import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable, non_inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { alpha_repr } from "../../exp/exp-alpha-repr"
import * as Pattern from "../../pattern"
import { fn_evaluable } from "./fn-evaluable"
import { fn_checkable } from "./fn-checkable"

export type Fn = Evaluable &
  Checkable &
  Inferable &
  Repr & {
    kind: "Exp.fn"
    pattern: Pattern.Pattern
    ret: Exp
  }

export function Fn(pattern: Pattern.Pattern, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    pattern,
    ret,
    ...fn_evaluable(pattern, ret),
    ...fn_checkable(pattern, ret),
    ...non_inferable,
    repr: () => `(${Pattern.repr(pattern)}) => ${ret.repr()}`,
  }
}
