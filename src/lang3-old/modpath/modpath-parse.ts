import * as Modpath from "../modpath"

export function parse(str: string): Modpath.Modpath {
  const parts = str.split(".")
  const prefix = parts.slice(0, parts.length - 1)
  const name = parts[parts.length - 1]
  return Modpath.create(prefix, name)
}
