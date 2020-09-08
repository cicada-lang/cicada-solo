import { escape } from "./escape"

export function create_regexp(re: RegExp | string): RegExp {
  if (typeof re === "string") return new RegExp(escape(re))
  else return re
}
