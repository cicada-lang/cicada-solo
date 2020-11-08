import * as Exp from "../exp"
import * as ut from "../../ut"

export type Present = ut.Obj<any> | Array<any> | string

export function present(exp: Exp.Exp): Present {
  switch (exp.kind) {
    case "Exp.v": {
      return exp.name
    }
    case "Exp.fn": {
      return { $fn: [exp.name, present(exp.ret)] }
    }
    case "Exp.ap": {
      return { $ap: [present(exp.target), ...exp.args.map(present)] }
    }
    case "Exp.str": {
      return JSON.stringify(exp.value)
    }
    case "Exp.pattern": {
      return exp.value.flags
        ? { $pattern: [exp.label, exp.value.source, exp.value.flags] }
        : { $pattern: [exp.label, exp.value.source] }
    }
    case "Exp.grammar":
      const choices = {}
      for (const [choice_name, parts] of exp.choices) {
        Object.assign(choices, choice_present(exp.name, choice_name, parts))
      }
      return { $grammar: choices }
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
