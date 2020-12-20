import { Value } from "../../value"

export type Add1Value = {
  kind: "Value.add1"
  prev: Value
}

export function Add1Value(prev: Value): Add1Value {
  return {
    kind: "Value.add1",
    prev,
  }
}
