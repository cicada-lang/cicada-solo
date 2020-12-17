import { Readbackable } from "../../readbackable"
import { Quote } from "../quote"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export type QuoteValue = Readbackable & {
  kind: "Value.quote"
  str: string
}

export function QuoteValue(str: string): QuoteValue {
  return {
    kind: "Value.quote",
    str,
    ...Readbackable({
      readbackability: (t, { mod, ctx }) => {
        if (t.kind === "Value.type") {
          return Quote(str)
        }
        if (t.kind === "Value.str") {
          return Quote(str)
        }
        if (t.kind === "Value.quote" && t.str === str) {
          return Quote(str)
        }
        throw new Trace.Trace(
          `Fail to readback QuoteValue(${str}).\n` + `- t: ${ut.inspect(t)}\n`
        )
      },
    }),
  }
}
