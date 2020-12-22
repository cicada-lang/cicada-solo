import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Quote = Evaluable &
  Checkable &
  Inferable &
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
    ...Inferable({
      inferability: ({ ctx }) => Value.str,
    }),
    repr: () => `"${str}"`,
    alpha_repr: () => `"${str}"`,
  }
}
