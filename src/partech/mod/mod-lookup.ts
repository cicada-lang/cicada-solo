import * as Mod from "../mod"
import * as Exp from "../exp"

export function lookup(mod: Mod.Mod, name: string): undefined | Exp.Exp {
  return mod.map.get(name)
}
