import { Exp } from "../../exp"

export type The = {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export function The(t: Exp, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
  }
}
