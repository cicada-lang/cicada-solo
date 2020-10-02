import * as Closure from "../closure"
import * as Env from "../../env"
import * as Exp from "../../exp"

// NOTE conservative equivalent:
// - name must be the same.
export function equal(x: Closure.Closure, y: Closure.Closure): boolean {
  if (x === y) return true
  return (
    x.name === y.name &&
    Exp.equal(x.exp, y.exp) &&
    x.mod === y.mod &&
    Env.equal(x.env, y.env)
  )
}
