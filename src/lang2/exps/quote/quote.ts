import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Quote = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.quote"
    str: string
  }

export function Quote(str: string): Quote {
  return {
    kind: "Exp.quote",
    str,
    evaluability: (_) => Value.quote(str),
    repr: () => `"${str}"`,
    alpha_repr: () => `"${str}"`,
  }
}
