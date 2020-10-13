import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"

export function lookup_entry(
  mod: Mod.Mod,
  name: string
): undefined | { t?: Exp.Exp; exp: Exp.Exp } {
  const entry = mod.map.get(name)
  return entry
}
