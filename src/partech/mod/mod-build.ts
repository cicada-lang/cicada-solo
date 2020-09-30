import * as Mod from "../mod"
import * as Exp from "../exp"

export function build(present: Mod.Present): Mod.Mod {
  const mod = Mod.create()
  for (const [name, exp_present] of Object.entries(present)) {
    Mod.update(mod, name, Exp.build(exp_present))
  }
  return mod
}
