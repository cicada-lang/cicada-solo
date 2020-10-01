import * as Mod from "../mod"
import * as Exp from "../exp"
import * as ut from "../../ut"

export function build(present: Mod.Present): Mod.Mod {
  const map = new Map()
  const metadata: Mod.Metadata = {}
  const mod = { map, metadata }
  for (const [name, value] of Object.entries(present)) {
    if (name.startsWith("$")) {
      const key = name.slice(1)
      metadata[key] = value
    } else {
      const exp = Exp.build(value)
      if (exp.kind === "Exp.grammar" && exp.name !== name)
        throw new Error(
          ut.aline(`
             |When bind a grammar to a name,
             |the grammar name must be the same as the name.
             |- grammar name: ${exp.name}
             |- name: ${name}
             |`)
        )
      Mod.update(mod, name, exp)
    }
  }
  return mod
}
