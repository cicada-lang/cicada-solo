import * as Mod from "../mod"
import * as Exp from "../exp"

export function create(map: Map<string, Exp.Exp> = new Map()): Mod.Mod {
  return {
    map,
  }
}
