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
    let s = pretty_scope(scope, "\n")
    s += `-> ${pretty_exp(return_type)}\n`
    return pretty_flower_block(s)
  }

  // case Fn(type_map: ListMap[String, Exp], body: Exp) =>
  //   var s = type_map.map {
  //     case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
  //   }.mkString("")
  //   s = s + s"=> ${pretty_exp(body)}\n"
  //   s"{${maybe_ln(s)}}"

  // case FnCase(cases) =>
  //   var s = cases.map {
  //     case (type_map, body) =>
  //       var s = type_map.map {
  //         case (name, exp) => s"${name} : ${pretty_exp(exp)}"
  //       }.mkString(", ")
  //       s"case ${s} => ${pretty_exp(body)}\n"
  //   }.mkString("")
  //   s"{${maybe_ln(s)}}"

  // case Ap(target: Exp, args: List[Exp]) =>
  //   val s = args.map {
  //     case exp => pretty_exp(exp)
  //   }.mkString(", ")
  //   s"${pretty_exp(target)}(${s})"

  // case Cl(defined, type_map: ListMap[String, Exp]) =>
  //   var d = defined.map {
  //     case (name, (t, exp)) => s"${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
  //   }.mkString("")
  //   var s = type_map.map {
  //     case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
  //   }.mkString("")
  //   s"class {${maybe_ln(d)}${maybe_ln(s)}}"

  // case Obj(value_map: ListMap[String, Exp]) =>
  //   var s = value_map.map {
  //     case (name, exp) => s"${name} = ${pretty_exp(exp)}\n"
  //   }.mkString("")
  //   s"object {${maybe_ln(s)}}"

  // case Dot(target: Exp, field: String) =>
  //   s"${pretty_exp(target)}.${field}"

  // case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
  //   var s = block_entry_map.map {
  //     case (name, BlockEntryLet(exp)) => s"${name} = ${pretty_exp(exp)}\n"
  //     case (name, BlockEntryDefine(t, exp)) => s"${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
  //   }.mkString("")
  //   s = s + s"${pretty_exp(body)}\n"
  //   s"{${maybe_ln(s)}}"

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
