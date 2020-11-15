import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Value from "../value"

export function update(
  mod: Mod.Mod,
  name: string,
  den: Mod.Den.Den,
  opts: {
    cached_value?: Value.Value
  } = {}
): Mod.Mod {
  const entry = { den, cached_value: opts.cached_value }
  mod.map.set(name, entry)
  return mod
}
