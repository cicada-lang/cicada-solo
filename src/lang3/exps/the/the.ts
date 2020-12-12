import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import { the_evaluable } from "./the-evaluable"
import { the_inferable } from "./the-inferable"

export type The = Evaluable &
  Checkable &
  Inferable &
  Repr & {
    kind: "Exp.the"
    t: Exp
    exp: Exp
  }

export function The(t: Exp, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    ...the_evaluable(t, exp),
    ...the_inferable(t, exp),
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
  }
}
