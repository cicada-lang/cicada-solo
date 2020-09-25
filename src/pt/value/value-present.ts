import * as Value from "../value"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Exp from "../exp"
import { Obj } from "../../ut"

export type Present = Obj<any> | Array<any> | string

export type PresentOpts = {
  on_grammar: on_grammar_t
}

const DEFAULT_PRESENT_OPTS: PresentOpts = {
  on_grammar: "as_exp",
}

type on_grammar_t = "force_one_step" | "only_show_name" | "as_exp"

export function present(
  value: Value.Value,
  opts: PresentOpts = DEFAULT_PRESENT_OPTS
): Present {
  switch (value.kind) {
    case "Value.fn": {
      const {
        ret_cl: { name, exp },
      } = value
      return { $fn: [name, Exp.present(exp)] }
    }
    case "Value.str": {
      return JSON.stringify(value.value)
    }
    case "Value.pattern": {
      return { $pattern: `${value.label}#${value.value.source}` }
    }
    case "Value.grammar": {
      const { name, delayed } = value
      switch (opts.on_grammar) {
        case "force_one_step": {
          const result = {}
          for (const [choice_name, parts] of Value.DelayedChoices.force(
            delayed
          )) {
            Object.assign(
              result,
              Value.choice_present(name, choice_name, parts)
            )
          }
          return result
        }
        case "as_exp": {
          const result = {}
          for (const [choice_name, parts] of delayed.choices) {
            Object.assign(result, Exp.choice_present(name, choice_name, parts))
          }
          return result
        }
        case "only_show_name": {
          return name
        }
      }
    }
  }
}

export function choice_present(
  grammar_name: string,
  choice_name: string,
  parts: Array<{ name?: string; value: Value.Value }>
): { [key: string]: Array<Present> } {
  return {
    [`${grammar_name}:${choice_name}`]: parts.map((part) => {
      const { name, value } = part
      return name
        ? { [name]: present(value, { on_grammar: "only_show_name" }) }
        : present(value, { on_grammar: "only_show_name" })
    }),
  }
}
