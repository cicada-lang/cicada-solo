import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Ty from "../../ty"
import { the_evaluable } from "./the-evaluable"

export type The = Evaluable & {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export function The(t: Ty.Ty, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    ...the_evaluable(t, exp)
  }
}
