import * as Normal from "../normal"
import * as Value from "../value"

export function create(t: Value.Value, value: Value.Value): Normal.Normal {
  return { t, value }
}
