import { NotYetValue } from "./not-yet-value"
import { Value } from "../../value"

declare module "./not-yet-value" {
  namespace NotYetValue {
    function is(value: Value): value is NotYetValue
  }
}

NotYetValue.is = function (value: Value): value is NotYetValue {
  return value.kind === "NotYetValue"
}
