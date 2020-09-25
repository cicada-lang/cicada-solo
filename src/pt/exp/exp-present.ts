import * as Exp from "../exp"
import { Obj } from "../../ut"

export type Present = Obj<any> | Array<any> | string

export function present(exp: Exp.Exp): Present {
  switch (exp.kind) {
    case "Exp.v": {
      const { name } = exp
      return name
    }
    case "Exp.fn": {
      const { name, ret } = exp
      return { $fn: [name, present(ret)] }
    }
    case "Exp.ap": {
      const { target, args } = exp
      return { $ap: [present(target), ...args.map(present)] }
    }
    case "Exp.str": {
      const { value } = exp
      return JSON.stringify(value)
    }
    case "Exp.pattern": {
      const { label, value } = exp
      return { $pattern: `${label}#${value.source}` }
    }
    case "Exp.grammar":
      const { name, choices } = exp
      const result = {}
      for (const [choice_name, parts] of choices) {
        Object.assign(result, choice_present(name, choice_name, parts))
      }
      return result
  }
}

export function choice_present(
  grammar_name: string,
  choice_name: string,
  parts: Array<{ name?: string; value: Exp.Exp }>
): { [key: string]: Array<Present> } {
  return {
    [`${grammar_name}:${choice_name}`]: parts.map((part) => {
      const { name, value } = part
      return name ? { [name]: present(value) } : present(value)
    }),
  }
}
