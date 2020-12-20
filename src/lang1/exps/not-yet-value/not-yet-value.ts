import { Ty } from "../../ty"
import { Neutral } from "../../neutral"

export type NotYetValue = {
  kind: "NotYetValue"
  t: Ty
  neutral: Neutral
}

export function NotYetValue(t: Ty, neutral: Neutral): NotYetValue {
  return {
    kind: "NotYetValue",
    t,
    neutral,
  }
}
