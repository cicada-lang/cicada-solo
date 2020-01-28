import assert from "assert"
import * as Exp from "./exp"
import * as Value from "./value"
import * as Scope from "./scope"

export function pretty_exp(exp: Exp.Exp): string {

  if (exp instanceof Exp.Var) {
    let { name } = exp
    return name
  }

  else if (exp instanceof Exp.Type) {
    return "type"
  }

  else if (exp instanceof Exp.StrType) {
    return "string_t"
  }

  else if (exp instanceof Exp.Str) {
    let { str } = exp
    return `"${str}"`
  }

  else if (exp instanceof Exp.Pi) {
    let { scope, return_type } = exp
    let s = ""
    s += pretty_scope(scope, "\n")
    s += ` -> ${pretty_exp(return_type)}`
    return pretty_flower_block(s)
  }

  else if (exp instanceof Exp.Fn) {
    let { scope, body } = exp
    let s = ""
    s += pretty_scope(scope, "\n")
    s += ` => ${pretty_exp(body)}`
    return pretty_flower_block(s)
  }

  else if (exp instanceof Exp.FnCase) {
    let { cases } = exp
    let s = ""
    s += cases.map(fn => {
      let { scope, body } = fn
      let scope_str = pretty_scope(scope, "\n")
      return `case ${scope_str} => ${pretty_exp(body)}`
    }).join("\n")
    return `choice ${pretty_flower_block(s)}`
  }

  else if (exp instanceof Exp.Ap) {
    let { target, args } = exp
    let s = ""
    s += pretty_exp(target)
    s += "("
    s += args.map(pretty_exp).join(", ")
    s += ")"
    return s
  }

  else if (exp instanceof Exp.Cl) {
    let { scope } = exp
    let s = ""
    s += pretty_scope(scope, "\n")
    return pretty_flower_block(s)
  }

  else if (exp instanceof Exp.Obj) {
    let { scope } = exp
    let s = ""
    s += pretty_scope(scope, "\n")
    return pretty_flower_block(s)
  }

  else if (exp instanceof Exp.Dot) {
    let { target, field_name } = exp
    let s = ""
    s += pretty_exp(target)
    s += "."
    s += field_name
    return s
  }

  else if (exp instanceof Exp.Block) {
    let { scope, body } = exp
    let s = ""
    s += pretty_scope(scope, "\n")
    s += `${pretty_exp(body)}\n`
    return `class ${pretty_flower_block(s)}`
  }

  else {
    throw new Error(
      "pretty_exp fail\n" +
        `unhandled class of Exp: ${exp.constructor.name}`)
  }
}

export function pretty_value(value: Value.Value): string {

  if (value instanceof Value.Type) {
    return "type"
  }

  else if (value instanceof Value.StrType) {
    return "string_t"
  }

  else if (value instanceof Value.Str) {
    let { str } = value
    return `"${str}"`
  }

  else if (value instanceof Value.Pi) {
    let { scope, return_type } = value
    let s = ""
    s += pretty_scope(scope, "\n")
    s += ` -> ${pretty_exp(return_type)}`
    return pretty_flower_block(s)
  }

  else if (value instanceof Value.Fn) {
    let { scope, body } = value
    let s = ""
    s += pretty_scope(scope, "\n")
    s += ` => ${pretty_exp(body)}`
    return pretty_flower_block(s)
  }

  else if (value instanceof Value.FnCase) {
    let { cases } = value
    let s = ""
    s += cases.map(fn => {
      let { scope, body } = fn
      let scope_str = pretty_scope(scope, "\n")
      return `case ${scope_str} => ${pretty_exp(body)}`
    }).join("\n")
    return `choice ${pretty_flower_block(s)}`
  }

  else if (value instanceof Value.Cl) {
    let { defined, scope } = value
    let s = ""
    s += pretty_defined(defined, "\n")
    if (pretty_defined(defined, "\n") !== "" &&
        pretty_scope(scope, "\n") !== "") {
      s += "\n"
    }
    s += pretty_scope(scope, "\n")
    return pretty_flower_block(s)
  }

  else if (value instanceof Value.Obj) {
    let { defined } = value
    let s = ""
    s += pretty_defined(defined, "\n")
    return pretty_flower_block(s)
  }

  else if (value instanceof Value.Neutral.Var) {
    let { name } = value
    return name
  }

  else if (value instanceof Value.Neutral.Ap) {
    let { target, args } = value
    let s = ""
    s += pretty_value(target)
    s += "("
    s += args.map(pretty_value).join(", ")
    s += ")"
    return s
  }

  else if (value instanceof Value.Neutral.Dot) {
    let { target, field_name } = value
    let s = ""
    s += pretty_value(target)
    s += "."
    s += field_name
    return s
  }

  else {
    throw new Error(
      "pretty_value fail\n" +
        `unhandled class of Value: ${value.constructor.name}\n` +
        `value: ${JSON.stringify(value, null, 2)}\n`)
  }
}

export function pretty_scope(
  scope: Scope.Scope,
  delimiter: string,
): string {
  let list: Array<string> = []

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      list.push(`${name} = ${pretty_exp(value)}`)
    }

    else if (entry instanceof Scope.Entry.Given) {
      let { t } = entry
      list.push(`${name} : ${pretty_exp(t)}`)
    }

    else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      list.push(`${name} : ${pretty_exp(t)} = ${pretty_exp(value)}`)
    }

    else {
      throw new Error(
        "pretty_scope fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}`)
    }
  }

  return list.join(delimiter)
}

export function pretty_defined(
  defined: Map<string, { t: Value.Value, value: Value.Value }>,
  delimiter: string,
): string {
  let list: Array<string> = []

  for (let [name, the] of defined) {
    let { t, value } = the
    list.push(`${name} : ${pretty_value(t)} = ${pretty_value(value)}`)
  }

  return list.join(delimiter)
}

export function indent(text: string, indentation: string = "  "): string {
  return text
    .split("\n")
    .map(line => indentation + line)
    .join("\n")
}

export function pretty_flower_block(text: string, indentation: string = "  "): string {
  return text === ""
    ? "{}"
    : "{" + "\n" + indent(text) + "\n" + "}"
}
