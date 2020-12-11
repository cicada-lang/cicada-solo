import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { equal_evaluable } from "./equal-evaluable"
import { equal_inferable } from "./equal-inferable"

export type Equal = Evaluable &
  Inferable &
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
