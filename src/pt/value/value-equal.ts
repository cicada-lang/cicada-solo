import * as Value from "../value"

export function equal(x: Value.Value, y: Value.Value): boolean {
  return true
}

export function equal_parts(
  x: Array<{ name?: string; value: Value.Value }>,
  y: Array<{ name?: string; value: Value.Value }>
): boolean {
  return true
}
