import * as Top from "../top"
import * as Mod from "../mod"
import * as Project from "../project"

export function run_tops(
  project: Project.Project,
  mod: Mod.Mod,
  tops: Array<Top.Top>
): string {
  for (const top of tops) {
    Top.define(project, mod, top)
  }

  for (const top of tops) {
    Top.check(mod, top)
  }

  let output = ""
  for (const top of tops) {
    output += Top.output(mod, top)
  }

  return output
}
