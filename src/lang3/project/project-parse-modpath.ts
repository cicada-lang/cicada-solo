import * as Project from "../project"

export function parse_modpath(
  modpath: string
): {
  prefix: Array<string>
  name: string
} {
  const parts = modpath.split(".")
  const prefix = parts.slice(0, parts.length - 1)
  const name = parts[parts.length - 1]
  return { prefix, name }
}
