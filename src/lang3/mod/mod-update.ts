import * as Mod from "../mod"
import * as Exp from "../exp"

export function update(
  mod: Mod.Mod,
  name: string,
  entry: {
    t?: Exp.Exp
    exp: Exp.Exp
  }
): Mod.Mod {
  mod.map.set(name, entry)
  return mod
}
