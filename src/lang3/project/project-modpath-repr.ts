import * as Project from "../project"

export function modpath_repr(the: {
  prefix: Array<string>
  name: string
}): string {
  if (the.prefix.length === 0) return name
  return `${the.prefix.join(".")}.${the.name}`
}
