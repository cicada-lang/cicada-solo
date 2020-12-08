import { evaluator } from "../evaluator"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Evaluate from "../evaluate"
import * as Infer from "../infer"

export function lookup_type(
  mod: Mod.Mod,
  name: string
): undefined | Value.Value {
  const entry = Mod.lookup_entry(mod, name)
  if (entry === undefined) return undefined
  switch (entry.den.kind) {
    case "Mod.Den.mod": {
      const den_mod = entry.den.mod
      return Value.cls(
        Mod.names(den_mod).map((name) => ({
          name,
          t: Mod.lookup_type(den_mod, name)!,
          value: Mod.lookup_value(den_mod, name)!,
        })),
        Value.Telescope.empty
      )
    }
    case "Mod.Den.def": {
      if (entry.den.t === undefined)
        return Infer.infer(mod, Ctx.init(), entry.den.exp)
      return evaluator.evaluate(entry.den.t, { mod, env: Env.init() })
    }
    case "Mod.Den.typecons": {
      return evaluator.evaluate(entry.den.typecons.t, { mod, env: Env.init() })
    }
  }
}
