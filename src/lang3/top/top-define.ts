import * as Top from "../top"
import * as Mod from "../mod"
import * as Project from "../project"
import * as Modpath from "../modpath"

export function define(
  project: Project.Project,
  mod: Mod.Mod,
  top: Top.Top
): void {
  if (top.kind === "Top.import") {
    Mod.update(
      mod,
      top.modpath.name,
      Mod.Den.mod(top.modpath, Project.lookup_mod_or_init(project, top.modpath))
    )
  }

  if (top.kind === "Top.def") {
    Mod.update(mod, top.name, Mod.Den.def(top.exp, top.t))
  }

  if (top.kind === "Top.type_constructor") {
    Mod.update(
      mod,
      top.type_constructor.name,
      Mod.Den.type_constructor(top.type_constructor)
    )
  }
}
