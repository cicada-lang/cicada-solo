import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import { the_evaluable } from "./the-evaluable"

export type The = Evaluable &
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
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
  }
}
