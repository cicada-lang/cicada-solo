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
  switch (entry.den.kind) {
    case "Mod.Den.def": {
      if (entry.den.t === undefined)
        return Exp.infer(mod, Ctx.init(), entry.den.exp)
      return Exp.evaluate(mod, Env.init(), entry.den.t)
    }
    case "Mod.Den.datatype": {
      return Exp.evaluate(mod, Env.init(), entry.den.datatype.t)
    }
  }
}
