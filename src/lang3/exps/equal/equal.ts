import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { equal_evaluable } from "./equal-evaluable"
import { equal_inferable } from "./equal-inferable"

export type Equal = Evaluable &
  Inferable &
  Checkable &
  Repr &
  AlphaRepr & {
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
    alpha_repr: (opts) => {
      const t_repr = t.alpha_repr(opts)
      const from_repr = from.alpha_repr(opts)
      const to_repr = to.alpha_repr(opts)
      return `Equal(${t_repr}, ${from_repr}, ${to_repr})`
    },
  }
}
