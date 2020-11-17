import * as Project from "../project"

export function init(): Project.Project {
  const mod_map = new Map()
  return Project.create(mod_map)
}
