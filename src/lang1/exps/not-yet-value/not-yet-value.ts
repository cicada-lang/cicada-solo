import { Ty } from "../../ty"
import { Neutral } from "../../neutral"

export type NotYetValue = {
  kind: "Value.not_yet"
  t: Ty
  neutral: Neutral
}

export function NotYetValue(t: Ty, neutral: Neutral): NotYetValue {
  return {
    kind: "Value.not_yet",
    t,
    neutral,
  }
}
