import * as Mod from "../mod"
import * as Exp from "../exp"

export function update(
  mod: Mod.Mod,
  name: string,
  entry: Mod.Entry
): Mod.Mod {
  mod.map.set(name, entry)
  return mod
}
