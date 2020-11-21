import * as Modpath from "../modpath"

export function repr(modpath: Modpath.Modpath): string {
  if (modpath.prefix.length === 0) return modpath.name
  return `${modpath.prefix.join(".")}.${modpath.name}`
}
