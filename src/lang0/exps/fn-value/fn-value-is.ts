import { FnValue } from "./fn-value"
import { Value } from "../../value"

declare module "./fn-value" {
  namespace FnValue {
    function is(value: Value): value is FnValue
  }
}

FnValue.is = function (value: Value): value is FnValue {
  return value.kind === "FnValue"
}
