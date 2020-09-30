import * as Mod from "../mod"
import * as Exp from "../exp"
import { Obj } from "../../ut"

export type Present = Obj<Exp.Present>

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
