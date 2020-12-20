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
      readbackability: (t, { used }) =>
        as_nat_ty(t) && Add1(readback(used, t, prev)),
    }),
  }
}

export function is_add1_value(value: Value): value is Add1Value {
  return value.kind === "Add1Value"
}

export function as_add1_value(value: Value): Add1Value {
  if (is_add1_value(value)) return value
  throw new Error("Expecting Add1Value")
}
