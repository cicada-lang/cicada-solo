import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Repr } from "../../repr"

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
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
    evaluability: ({ env }) => evaluate(env, exp),
  }
}
