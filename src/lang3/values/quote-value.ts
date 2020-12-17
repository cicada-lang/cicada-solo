import { Ty } from "../ty"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import { Quote } from "../exps/str/quote"
import { readback_type } from "../readback/readback-type"

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
