import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Ty from "../../ty"
import { the_evaluable } from "./the-evaluable"
import { Repr } from "../../repr"

export type The = Evaluable &
  Repr & {
    kind: "Exp.the"
    t: Ty.Ty
    exp: Exp
  }

export function The(t: Ty.Ty, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    ...the_evaluable(t, exp),
    repr: () => `{ ${Ty.repr(t)} -- ${exp.repr()} }`,
  }
}
