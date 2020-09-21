import * as Exp from "../exp"
import { Obj } from "../../ut"

export type Present = Obj<any> | Array<any> | string

export function present(exp: Exp.Exp): Present {
  switch (exp.kind) {
    case "Exp.v": {
      // NOTE use extra [] to distinguish v from str in some cases.
      const { name } = exp
      return [name]
    }
    case "Exp.fn": {
      const { name, ret } = exp
      return { $fn: [name, present(ret)] }
    }
    case "Exp.ap": {
      const { target, args } = exp
      return [present(target), ...args.map(present)]
    }
    case "Exp.str": {
      const { value } = exp
      return value
    }
    case "Exp.pattern": {
      const { label, value } = exp
      return { $pattern: `${label}:${value.toString()}` }
    }
    case "Exp.gr":
      const { name, choices } = exp
      let result: Obj<any> = {}
      for (const [choice_name, parts] of choices) {
        const [key, present] = choice_present(name, choice_name, parts)
        result[key] = present
      }
      return result
  }
}

function choice_present(
  grammar_name: string,
  choice_name: string,
  parts: Array<{ name?: string; value: Exp.Exp }>
): [string, Array<Present>] {
  return [
    `${grammar_name}:${choice_name}`,
    parts.map((part) => {
      const { name, value } = part
      return name ? { name: strip(present(value)) } : present(value)
    }),
  ]
}

function strip(present: Present): Present {
  if (present instanceof Array && present.length === 1) {
    return present[0]
  } else {
    return present
  }
}
