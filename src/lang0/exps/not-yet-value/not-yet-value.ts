import { Exp } from "../../exp"
import { Neutral } from "../../neutral"

export type NotYetValue = {
  kind: "Value.not_yet"
  neutral: Neutral
}

export function NotYetValue(neutral: Neutral): NotYetValue {
  return {
    kind: "Value.not_yet",
    neutral,
  }
}
