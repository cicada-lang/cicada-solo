import * as Mod from "../mod"
import * as Exp from "../exp"
import * as ut from "../../ut"

export type Present = ut.Obj<Exp.Present> | Mod.Metadata

export function present(mod: Mod.Mod): Present {
  const present: Present = {}

  for (const [name, exp] of mod.map) {
    present[name] = Exp.present(exp)
  }

  for (const [key, value] of Object.entries(mod.metadata)) {
    present["$" + key] = value
  }

  return present
}
