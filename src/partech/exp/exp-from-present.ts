import * as Exp from "../exp"
import * as ut from "../../ut"

export function from_present(present: Exp.Present): Exp.Exp {
  if (typeof present === "string") return from_string(present)
  else return from_object(present)
}

function from_string(str: string): Exp.Exp {
  if (str.startsWith('"') && str.endsWith('"')) {
    return Exp.str(JSON.parse(str))
  } else {
    return Exp.v(str)
  }
}

function from_object(obj: ut.Obj<any>): Exp.Exp {
  if (obj.hasOwnProperty("$fn")) {
    const [name, ret] = obj["$fn"]
    return Exp.fn(name, Exp.from_present(ret))
  } else if (obj.hasOwnProperty("$ap")) {
    const [target, ...args] = obj["$ap"]
    return Exp.ap(Exp.from_present(target), args.map(Exp.from_present))
  } else if (obj.hasOwnProperty("$pattern")) {
    const [label, pattern, flags] = obj["$pattern"]
    if (pattern !== undefined) {
      return Exp.pattern(label, new RegExp(pattern, flags))
    } else {
      return Exp.pattern(label, new RegExp(".*", flags))
    }
  } else if (obj.hasOwnProperty("$grammar")) {
    return build_grammar(obj["$grammar"])
  } else {
    throw new Error(`Unknown object: ${ut.inspect(obj)}`)
  }
}

function build_grammar(obj: ut.Obj<any>): Exp.Exp {
  let name: string | undefined = undefined
  let choices = new Map()

  for (const [key, parts] of Object.entries(obj)) {
    const [grammar_name, choice_name] = key.split(":")

    if (name && name !== grammar_name) {
      throw new Error(
        `ambiguous grammar name.\n` +
          `new name: ${grammar_name}\n` +
          `old name: ${name}\n`
      )
    } else {
      name = grammar_name
    }

    choices.set(choice_name, parts.map(build_part))
  }

  if (name) {
    return Exp.grammar(name, choices)
  } else {
    throw new Error(`can not find grammar name from obj: ${ut.inspect(obj)}`)
  }
}

function build_part(part: any): { name?: string; value: Exp.Exp } {
  const result = parse_bind(part)
  if (result) {
    const [name, present] = result
    // NOTE a string in bind is special, it is always Exp.v -- instead of Exp.str.
    const value =
      typeof present === "string" ? Exp.v(present) : Exp.from_present(present)
    return { name, value }
  } else {
    return { value: Exp.from_present(part) }
  }
}

function parse_bind(present: Exp.Present): null | [string, Exp.Present] {
  if (typeof present === "string") return null
  if (present instanceof Array) return null
  const keys = Object.keys(present)
  if (keys.length !== 1) return null
  const key = keys[0]
  if (key.startsWith("$")) return null
  if (key.includes(":")) return null
  return [key, present[key]]
}
