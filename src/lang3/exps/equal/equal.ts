import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { alpha_repr } from "../../exp/exp-alpha-repr"
import { equal_evaluable } from "./equal-evaluable"
import { equal_inferable } from "./equal-inferable"

export type Equal = Evaluable &
  Inferable &
  Checkable &
  Repr & {
    kind: "Exp.equal"
    t: Exp
    from: Exp
    to: Exp
  }

export function Equal(t: Exp, from: Exp, to: Exp): Equal {
  return {
    kind: "Exp.equal",
    t,
    from,
    to,
    ...equal_evaluable(t, from, to),
    ...equal_inferable(t, from, to),
    repr: () => `Equal(${t.repr()}, ${from.repr()}, ${to.repr()})`,
  }
}
