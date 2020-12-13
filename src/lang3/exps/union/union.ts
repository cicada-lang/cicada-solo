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
  Repr &
  AlphaRepr & {
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
    alpha_repr: (opts) => {
      // NOTE handle associativity and commutative of union
      const exps = union_flatten(left, right)
      const parts = exps.map((exp) => alpha_repr(exp, opts)).sort()
      return `{ ${parts.join("\n")} }`
    },
  }
}

function union_flatten(left: Exp, right: Exp): Array<Exp> {
  const left_parts =
    left.kind === "Exp.union" ? union_flatten(left.left, left.right) : [left]
  const right_parts =
    right.kind === "Exp.union"
      ? union_flatten(right.left, right.right)
      : [right]
  return [...left_parts, ...right_parts]
}
