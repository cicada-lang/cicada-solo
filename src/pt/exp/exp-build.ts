import * as Exp from "../exp"
import { Obj } from "../../ut"
import * as ut from "../../ut"

export function build(present: Exp.Present): Exp.Exp {
  if (typeof present === "string") return from_string(present)
  else if (present instanceof Array) return from_array(present)
  else return from_object(present)
}

function from_string(str: string): Exp.Exp {
  return Exp.str(str)
}

function from_array(array: Array<any>): Exp.Exp {
  if (array.length === 1) {
    if (typeof array[0] === "string") {
      return Exp.v(array[0])
    } else {
      throw new Error(
        `expecting array[0] to be a string\n.` +
          `array[0]: ${ut.inspect(array[0])}\n`
      )
    }
  } else if (array.length > 1) {
    const [target, ...args] = array
    return Exp.ap(build(target), args.map(build))
  } else {
    throw new Error(
      `array.length must be >= 1.\n` + `array.length: ${array.length}\n`
    )
  }
}

function from_object(obj: Obj<any>): Exp.Exp {
  if (obj.hasOwnProperty("$fn")) {
    const [name, ret] = obj["$fn"]
    return Exp.fn(name, build(ret))
  } else if (obj.hasOwnProperty("$pattern")) {
    const [label, value] = obj["$pattern"].split(":")
    return Exp.pattern(label, new RegExp(value))
  } else {
    return build_gr(obj)
    throw new Error()
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

function build_gr(obj: Obj<any>): Exp.Exp {
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

    const new_parts = parts.map((part: any) => {
      const result = parse_bind(part)
      if (result) {
        const [name, present] = result
        const value =
          typeof present === "string" ? Exp.v(present) : build(present)
        return { name, value }
      } else {
        return { value: build(part) }
      }
    })

    choices.set(choice_name, new_parts)
  }

  if (name) {
    return Exp.gr(name, choices)
  } else {
    throw new Error(`can not find grammar name from obj: ${ut.inspect(obj)}`)
  }
}
