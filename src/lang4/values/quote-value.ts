import { Value } from "../value"

export type QuoteValue = Value & {
  kind: "QuoteValue"
  str: string
}

export function QuoteValue(str: string): QuoteValue {
  return {
    kind: "QuoteValue",
    str,
  }
}
