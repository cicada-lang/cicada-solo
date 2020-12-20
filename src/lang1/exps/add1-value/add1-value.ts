import { Value } from "../../value"

export type Add1Value = {
  kind: "Add1Value"
  prev: Value
}

export function Add1Value(prev: Value): Add1Value {
  return {
    kind: "Add1Value",
    prev,
  }
}
