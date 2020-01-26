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
    s += `-> ${pretty_exp(return_type)}\n`
    return pretty_flower_block(s)
  }

  else if (exp instanceof Exp.Fn) {
    let { scope, body } = exp
    let s = ""
    s += pretty_scope(scope, "\n")
    s += `=> ${pretty_exp(body)}\n`
    return pretty_flower_block(s)
  }

  else if (exp instanceof Exp.FnCase) {
    let { cases } = exp
    let s = ""
    for (let fn of cases) {
      let { scope, body } = fn
      s += pretty_scope(scope, "\n")
      s += `=> ${pretty_exp(body)}\n`
    }
    return pretty_flower_block(s)
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
    return `${pretty_exp(target)}.${field_name}`
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
  throw new Error("TODO")
}

export function pretty_scope(scope: Scope.Scope, delimiter: string): string {
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
