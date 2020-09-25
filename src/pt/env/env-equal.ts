import * as Env from "../env"
import * as Value from "../value"

export function equal(x: Env.Env, y: Env.Env): boolean {
  if (x.size !== y.size) return false
  for (const [key, x_values] of x.entries()) {
    const y_values = y.get(key)
    if (y_values === undefined) return false
    if (!equal_values(x_values, y_values)) return false
  }
  return true
}

function equal_values(x: Array<Value.Value>, y: Array<Value.Value>): boolean {
  if (x.length !== y.length) return false
  for (let i = 0; i < x.length; i++) {
    if (!Value.equal(x[i], y[i])) return false
  }
  return true
}
