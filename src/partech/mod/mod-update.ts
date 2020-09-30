import * as Mod from "../mod"
import * as Exp from "../exp"

export function update(mod: Mod.Mod, name: string, exp: Exp.Exp): void {
  mod.map.set(name, exp)
}
