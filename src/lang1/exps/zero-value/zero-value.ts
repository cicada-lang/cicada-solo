import { Readbackable } from "../../readbackable"
import { Zero } from "../zero"
import { as_nat_ty } from "../nat-ty"

export type ZeroValue = Readbackable & {
  kind: "ZeroValue"
}

export const ZeroValue: ZeroValue = {
  kind: "ZeroValue",
  ...Readbackable({
    readbackability: (t, { used }) => as_nat_ty(t) && Zero,
  }),
}
