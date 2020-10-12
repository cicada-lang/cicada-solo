import * as Mod from "../mod"

export function clone(mod: Mod.Mod): Mod.Mod {
  const map = new Map(mod.map)
  return { map }
}
