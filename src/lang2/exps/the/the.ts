import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"

export type The = Evaluable & {
  kind: "Exp.the"
  t: Exp
  exp: Exp
}

export function The(t: Exp, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    evaluability: ({ env }) => evaluate(env, exp),
  }
}
