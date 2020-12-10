import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { equal_evaluable } from "./equal-evaluable"

export type Equal = Evaluable &
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
    repr: () => `Equal(${t.repr()}, ${from.repr()}, ${to.repr()})`,
  }
}
