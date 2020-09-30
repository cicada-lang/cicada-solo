import * as Mod from "../mod"
import * as Exp from "../exp"

export function get(mod: Mod.Mod, name: string): undefined | Exp.Exp {
  return mod.get(name)
}
