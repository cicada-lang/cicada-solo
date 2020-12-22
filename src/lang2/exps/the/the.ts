import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type The = Evaluable &
  Repr &
  AlphaRepr & {
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
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
    alpha_repr: (opts) =>
      `{ ${t.alpha_repr(opts)} -- ${exp.alpha_repr(opts)} }`,
  }
}
