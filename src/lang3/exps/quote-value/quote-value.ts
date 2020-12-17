import { ReadbackAsType } from "../../readback-as-type"
import { Quote } from "../quote"

export type QuoteValue = ReadbackAsType & {
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
