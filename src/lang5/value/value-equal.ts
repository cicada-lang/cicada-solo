import { Value } from "./value"
import * as ut from "../../ut"

export function value_equal(x: Value, y: Value): boolean {
  return x.kind === y.kind && x.semantic_repr() === y.semantic_repr()
}
