import { Exp } from "../../exp"
import * as Ty from "../../ty"

export type The = {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export function The(t: Ty.Ty, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
  }
}
