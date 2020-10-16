import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"

export function lookup_value(
  mod: Mod.Mod,
  name: string
): undefined | Value.Value {
  const entry = Mod.lookup_entry(mod, name)
  if (entry === undefined) return undefined
  if (entry.cached_value !== undefined) return entry.cached_value
  switch (entry.den.kind) {
    case "Mod.Den.def": {
      return Exp.evaluate(mod, Env.init(), entry.den.exp)
    }
    case "Mod.Den.datatype": {
      return Exp.evaluate(mod, Env.init(), entry.den.datatype)
    }
  }
}
