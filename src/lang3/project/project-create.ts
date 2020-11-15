import * as Project from "../project"
import * as Mod from "../mod"

export function create(mod_map: Map<string, Mod.Mod>): Project.Project {
  return { mod_map }
}
