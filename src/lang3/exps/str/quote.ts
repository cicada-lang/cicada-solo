import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { quote_evaluable } from "./quote-evaluable"
import { quote_checkable } from "./quote-checkable"

export type Quote = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.quote"
    str: string
  }

export function Quote(str: string): Quote {
  return {
    kind: "Exp.quote",
    str,
    ...quote_evaluable(str),
    ...quote_checkable(str),
    repr: () => `"${str}"`,
  }
}
