import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Quote = Evaluable & {
  kind: "Exp.quote"
  str: string
}

export function Quote(str: string): Quote {
  return {
    kind: "Exp.quote",
    str,
    evaluability: (_) => Value.quote(str),
  }
}
