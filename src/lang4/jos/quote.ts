import { Jo } from "../jo"
import { World } from "../world"
import { StrValue } from "../values/str-value"
import { QuoteValue } from "../values/quote-value"

export type Quote = Jo & {
  str: string
}

export function Quote(str: string): Quote {
  return {
    str,
    composability: (world) => world.push(QuoteValue(str)),
    cuttability: (world) => world.push(StrValue),
  }
}
