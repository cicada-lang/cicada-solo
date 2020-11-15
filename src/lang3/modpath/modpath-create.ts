import * as Modpath from "../modpath"

export function create(prefix: Array<string>, name: string): Modpath.Modpath {
  return { prefix, name }
}
