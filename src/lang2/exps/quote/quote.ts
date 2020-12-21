import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"

export type Quote = Evaluable &
  Repr & {
    kind: "Exp.quote"
    str: string
  }

export function Quote(str: string): Quote {
  return {
    kind: "Exp.quote",
    str,
    repr: () => `"${str}"`,
    evaluability: (_) => Value.quote(str),
  }
}
