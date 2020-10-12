import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"

export function lookup(mod: Mod.Mod, name: string): undefined | Value.Value {
  const exp = mod.map.get(name)
  if (exp === undefined) return undefined
  const env = Env.init()
  // NOTE maybe use try and Trace
  const value = Exp.evaluate(mod, env, exp)
  return value
}
