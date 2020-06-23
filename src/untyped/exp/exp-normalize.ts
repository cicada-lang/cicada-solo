import * as Value from "../value"
import * as Exp from "../exp"
import * as Env from "../env"

export function normalize(exp: Exp.Exp): Exp.Exp {
  const env = Env.init()
  const value = Exp.evaluate(env, exp)
  return Value.readback(new Set(), value)
}
