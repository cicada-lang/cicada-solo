import { Readbackable } from "../../readbackable"
import { Zero } from "../zero"

export type ZeroValue = Readbackable & {
  kind: "ZeroValue"
}

export const ZeroValue: ZeroValue = {
  kind: "ZeroValue",
  ...Readbackable({
    readbackability: (t, { used }) => Zero,
  }),
}
