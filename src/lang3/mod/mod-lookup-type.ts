import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"

export function lookup_type(
  mod: Mod.Mod,
  name: string
): undefined | Value.Value {
  const exp = mod.map.get(name)
  if (exp === undefined) return undefined
  // NOTE maybe use try and Trace
  if (exp.kind === "Exp.the") {
    const env = Env.init()
    return Exp.evaluate(mod, env, exp.t)
  }
  const value = Exp.infer(mod, Ctx.init(), exp)
  return value
}
