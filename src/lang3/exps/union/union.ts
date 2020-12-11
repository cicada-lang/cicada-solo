import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import { union_evaluable } from "./union-evaluable"
import { union_inferable } from "./union-inferable"

export type Union = Evaluable &
  Inferable &
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
