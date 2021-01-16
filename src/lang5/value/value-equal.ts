import { Value } from "./value"
import * as ut from "../../ut"

export function value_equal(x: Value, y: Value): boolean {
  const x_hash = x.semantic_repr ? x.semantic_repr() : x.repr()
  const y_hash = y.semantic_repr ? y.semantic_repr() : y.repr()
  return x.kind === y.kind && x_hash === y_hash
}
