import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { alpha_repr } from "../../exp/exp-alpha-repr"
import { Exp } from "../../exp"
import { union_evaluable } from "./union-evaluable"
import { union_inferable } from "./union-inferable"

export type Union = Evaluable &
  Inferable &
  Checkable &
  Repr & {
    kind: "Exp.union"
    left: Exp
    right: Exp
  }

export function Union(left: Exp, right: Exp): Union {
  return {
    kind: "Exp.union",
    left,
    right,
    ...union_evaluable(left, right),
    ...union_inferable(left, right),
    repr: () => `{ ${left.repr()} | ${right.repr()} }`,
  }
}
