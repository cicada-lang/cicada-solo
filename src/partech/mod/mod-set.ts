import * as Mod from "../mod"
import * as Exp from "../exp"

export function set(mod: Mod.Mod, name: string, exp: Exp.Exp): Mod.Mod {
  return mod.set(name, exp)
}
