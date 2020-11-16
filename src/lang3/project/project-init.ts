import * as Project from "../project"
import * as Mod from "../mod"

export function init(): Project.Project {
  const mod_map = new Map()
  return Project.create(mod_map)
}
