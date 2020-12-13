import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { Exp } from "../../exp"
import { the_evaluable } from "./the-evaluable"
import { the_inferable } from "./the-inferable"

export type The = Evaluable &
  Checkable &
  Inferable &
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
    ...the_evaluable(t, exp),
    ...the_inferable(t, exp),
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
    alpha_repr: (opts) =>
      `{ ${t.alpha_repr(opts)} -- ${exp.alpha_repr(opts)} }`,
  }
}
