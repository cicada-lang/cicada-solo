import * as Value from "../value"

export function equal(x: Value.Value, y: Value.Value): boolean {
  return true
}

export function equal_parts(
  x: Array<{ name?: string; value: Value.Value }>,
  y: Array<{ name?: string; value: Value.Value }>
): boolean {
  if (x.length !== y.length) return false
  for (let i = 0; i < x.length; i++) {
    if (x[i].name !== y[i].name) return false
    if (!equal(x[i].value, y[i].value)) return false
  }
  return true
}
