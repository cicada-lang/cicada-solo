import * as Project from "../project"
import * as Modpath from "../modpath"
import * as Mod from "../mod"

export function lookup_mod(
  project: Project.Project,
  modpath: Modpath.Modpath
): undefined | Mod.Mod {
  const key = Modpath.repr(modpath)
  return project.mod_map.get(key)
}
