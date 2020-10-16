import * as Mod from "../mod"

export function clone(mod: Mod.Mod): Mod.Mod {
  return { map: new Map(mod.map) }
}
