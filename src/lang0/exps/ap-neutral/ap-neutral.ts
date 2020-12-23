import { Value } from "../../value"
import { Neutral } from "../../neutral"

export type ApNeutral = {
  kind: "Neutral.ap"
  target: Neutral
  arg: Value
}

export function ApNeutral(target: Neutral, arg: Value): ApNeutral {
  return {
    kind: "Neutral.ap",
    target,
    arg,
  }
}
