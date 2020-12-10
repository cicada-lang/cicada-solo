import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import { union_evaluable } from "./union-evaluable"

export type Union = Evaluable &
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
    repr: () => `{ ${left.repr()} | ${right.repr()} }`,
  }
}
