import { Exp } from "../../exp"
import { Neutral } from "../../neutral"
import { Readbackable } from "../../readbackable"

export type NotYetValue = Readbackable & {
  kind: "NotYetValue"
  neutral: Neutral
}

export function NotYetValue(neutral: Neutral): NotYetValue {
  return {
    kind: "NotYetValue",
    neutral,
    ...Readbackable({
      readbackability: ({ used }) => neutral.readback_neutral({ used }),
    }),
  }
}
