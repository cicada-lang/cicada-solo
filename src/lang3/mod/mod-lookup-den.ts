import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"

export function lookup_den(
  mod: Mod.Mod,
  name: string
): undefined | Mod.Den.Den {
  const entry = mod.map.get(name)
  if (entry) return entry.den
  else return undefined
}
