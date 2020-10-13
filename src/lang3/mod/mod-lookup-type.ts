import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"

export function lookup_type(
  mod: Mod.Mod,
  name: string
): undefined | Value.Value {
  const entry = Mod.lookup_entry(mod, name)
  if (entry === undefined) return undefined
  // NOTE maybe use try and Trace
  if (entry.t === undefined) return Exp.infer(mod, Ctx.init(), entry.exp)
  return Exp.evaluate(mod, Env.init(), entry.t)
}
