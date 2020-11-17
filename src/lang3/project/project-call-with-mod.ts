import * as Project from "../project"
import * as Modpath from "../modpath"
import * as Mod from "../mod"

export function call_with_mod<A>(
  project: Project.Project,
  modpath: undefined | Modpath.Modpath,
  f: (mod: Mod.Mod) => A
): A {
  if (modpath === undefined) {
    const mod = Mod.init()
    return f(mod)
  }

  const key = Modpath.repr(modpath)
  let mod = project.mod_map.get(key)
  if (mod === undefined) {
    mod = Mod.init()
    project.mod_map.set(key, mod)
  }
  return f(mod)
}
