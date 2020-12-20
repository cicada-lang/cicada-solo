import { Readbackable } from "../../readbackable"
import { Value } from "../../value"
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

export function is_zero_value(value: Value): value is ZeroValue {
  return value.kind === "ZeroValue"
}

export function as_zero_value(value: Value): ZeroValue {
  if (is_zero_value(value)) return value
  throw new Error("Expecting ZeroValue")
}
