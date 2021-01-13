import { Value } from "./value"
import * as ut from "../../ut"

export function value_equal(x: Value, y: Value): boolean {
  return ut.equal(JSON.stringify(x), JSON.stringify(y))
}
