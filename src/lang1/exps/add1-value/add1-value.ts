import { Value } from "../../value"
import { Readbackable } from "../../readbackable"
import { Exp } from "../../exp"
import { readback } from "../../readback"
import { Add1 } from "../add1"
import { as_nat_ty } from "../nat-ty"

export type Add1Value = Readbackable & {
  kind: "Add1Value"
  prev: Value
}

export function Add1Value(prev: Value): Add1Value {
  return {
    kind: "Add1Value",
    prev,
    ...Readbackable({
      readbackability: (t, { used }) => as_nat_ty(t) && Add1(readback(used, t, prev)),
    }),
  }
}
