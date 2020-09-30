import * as Mod from "../mod"
import * as Exp from "../exp"

export function build(present: Mod.Present): Mod.Mod {
  const map = new Map()
  const metadata: Mod.Metadata = {}
  const mod = { map, metadata }
  for (const [name, value] of Object.entries(present)) {
    if (name.startsWith("$")) {
      const key = name.slice(1)
      metadata[key] = value
    } else {
      Mod.update(mod, name, Exp.build(value))
    }
  }
  return mod
}
