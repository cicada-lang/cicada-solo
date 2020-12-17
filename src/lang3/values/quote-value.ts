import { Ty } from "../ty"
import { Quote } from "../exps/str/quote"

export type QuoteValue = Ty & {
  kind: "Value.quote"
  str: string
}

export function QuoteValue(str: string): QuoteValue {
  return {
    kind: "Value.quote",
    str,
    typed_readback(value, { mod, ctx }) {
      throw new Error("TODO")
    },
    readback_as_type: ({ mod, ctx }) => Quote(str),
  }
}
