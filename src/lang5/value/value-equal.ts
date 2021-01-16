import { Value } from "./value"
import * as ut from "../../ut"

export function value_equal(x: Value, y: Value): boolean {
  const x_hash = x.hash_repr ? x.hash_repr() : x.repr()
  const y_hash = y.hash_repr ? y.hash_repr() : y.repr()
  return x.kind === y.kind && x_hash === y_hash
}
