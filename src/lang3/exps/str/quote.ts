import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { quote_evaluable } from "./quote-evaluable"
import { quote_inferable } from "./quote-inferable"
import { quote_checkable } from "./quote-checkable"

export type Quote = Evaluable &
  Inferable &
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
    ...quote_inferable(str),
    ...quote_checkable(str),
    repr: () => `"${str}"`,
  }
}
