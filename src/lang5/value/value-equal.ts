import { Value } from "./value"
import * as ut from "../../ut"

export function value_equal(x: Value, y: Value): boolean {
  const x_hash = x.alpha_repr ? x.alpha_repr() : x.repr()
  const y_hash = y.alpha_repr ? y.alpha_repr() : y.repr()
  return x.kind === y.kind && x_hash === y_hash
}
