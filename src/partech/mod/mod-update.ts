import * as Mod from "../mod"
import * as Exp from "../exp"

export function update(mod: Mod.Mod, name: string, exp: Exp.Exp): Mod.Mod {
  return mod.set(name, exp)
}
