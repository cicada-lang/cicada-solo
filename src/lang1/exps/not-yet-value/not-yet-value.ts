import { Ty } from "../../ty"
import { Neutral } from "../../neutral"
import { Readbackable } from "../../readbackable"
import { readback_neutral } from "../../readback"
import * as ut from "../../../ut"

export type NotYetValue = Readbackable & {
  kind: "NotYetValue"
  t: Ty
  neutral: Neutral
}

export function NotYetValue(t: Ty, neutral: Neutral): NotYetValue {
  return {
    kind: "NotYetValue",
    t,
    neutral,
    ...Readbackable({
      readbackability: (u, { used }) => {
        if (ut.equal(u, t)) {
          return readback_neutral(used, neutral)
        }
        throw new Error(
          ut.aline(`
            |When trying to readback a annotated value,
            |the annotated type is: ${t.repr()},
            |but the given type is ${u.repr()}.
            |`)
        )
      },
    }),
  }
}
