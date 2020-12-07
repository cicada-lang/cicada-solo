import * as Mod from "../mod"

export function names(mod: Mod.Mod): Array<string> {
  return Array.from(mod.map.keys())
}
