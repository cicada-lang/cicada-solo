import { Jo } from "../jo"
import { World } from "../world"
import { StrValue } from "../values/str-value"
import { QuoteValue } from "../values/quote-value"

export type Quote = Jo & {
  kind: "Quote"
  str: string
}

export function Quote(str: string): Quote {
  return {
    kind: "Quote",
    str,
    compose: (world) => world.push(QuoteValue(str)),
    cut: (world) => world.push(StrValue),
  }
}
