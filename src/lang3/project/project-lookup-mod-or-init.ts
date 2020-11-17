import * as Project from "../project"
import * as Modpath from "../modpath"
import * as Mod from "../mod"

export function lookup_mod_or_init(
  project: Project.Project,
  modpath: Modpath.Modpath
): Mod.Mod {
  const key = Modpath.repr(modpath)
  const mod = project.mod_map.get(key)
  if (mod === undefined) {
    const new_mod = Mod.init()
    project.mod_map.set(key, new_mod)
    return new_mod
  }

  return mod
}
