import { Readbackable, ReadbackAsType } from "../../readbackable"
import { Quote } from "../quote"

export type QuoteValue = Readbackable & {
  kind: "Value.quote"
  str: string
}

export function QuoteValue(str: string): QuoteValue {
  return {
    kind: "Value.quote",
    str,
    ...ReadbackAsType({
      readback_as_type: ({ mod, ctx }) => Quote(str),
    }),
  }
}
