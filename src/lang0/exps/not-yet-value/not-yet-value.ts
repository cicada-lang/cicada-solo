import { Exp } from "../../exp"
import { Neutral } from "../../neutral"
import { Readbackable } from "../../readbackable"

export type NotYetValue = Readbackable & {
  kind: "Value.not_yet"
  neutral: Neutral
}

export function NotYetValue(neutral: Neutral): NotYetValue {
  return {
    kind: "Value.not_yet",
    neutral,
    ...Readbackable({
      readbackability: ({ used }) => neutral.readback_neutral({ used }),
    }),
  }
}
