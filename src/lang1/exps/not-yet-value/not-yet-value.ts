import { Ty } from "../../ty"
import { Value } from "../../value"
import { Neutral } from "../../neutral"
import { Readbackable } from "../../readbackable"
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
          return neutral.readback_neutral({ used })
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

export function is_not_yet_value(value: Value): value is NotYetValue {
  return value.kind === "NotYetValue"
}

export function as_not_yet_value(value: Value): NotYetValue {
  if (is_not_yet_value(value)) return value
  throw new Error("Expecting NotYetValue")
}
