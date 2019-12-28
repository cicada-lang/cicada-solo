package xieyuheng.cicada

import collection.immutable.ListMap

import xieyuheng.util.pretty._

object pretty {

  def pretty_exp(exp: Exp): String = {
    exp match {
      case Var(name: String) =>
        s"${name}"

      case Type() =>
        s"type"

      case StrType() =>
        s"string_t"

      case Str(str: String) =>
        val doublequote_char = '"'
        s"${doublequote_char}${str}${doublequote_char}"

      case Pi(type_map: ListMap[String, Exp], return_type: Exp) =>
        var s = type_map.map {
          case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"-> ${pretty_exp(return_type)}\n"
        s"{${maybe_ln(s)}}"

      case Fn(type_map: ListMap[String, Exp], body: Exp) =>
        var s = type_map.map {
          case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"=> ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"

      case Ap(target: Exp, arg_list: List[Exp]) =>
        val args = arg_list.map {
          case exp => pretty_exp(exp)
        }.mkString(", ")
        s"${pretty_exp(target)}(${args})"

      case Cl(defined, type_map: ListMap[String, Exp]) =>
        var d = defined.map {
          case (name, (t, exp)) => s"${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
        }.mkString("")
        var s = type_map.map {
          case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s"class {${maybe_ln(d)}${maybe_ln(s)}}"

      case Obj(value_map: ListMap[String, Exp]) =>
        var s = value_map.map {
          case (name, exp) => s"${name} = ${pretty_exp(exp)}\n"
        }.mkString("")
        s"object {${maybe_ln(s)}}"

      case Dot(target: Exp, field: String) =>
        s"${pretty_exp(target)}.${field}"

      case Union(type_list: List[Exp]) =>
        val s = type_list.map {
          case t => s"case ${pretty_exp(t)}\n"
        }.mkString("")
        s"union {${maybe_ln(s)}}"

      case Switch(name: String, cases: List[(Exp, Exp)]) =>
        val s = cases.map {
          case (t, v) => s"${pretty_exp(t)} => ${pretty_exp(v)}\n"
        }.mkString("")
        s"switch ${name} {${maybe_ln(s)}}"

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var s = block_entry_map.map {
          case (name, BlockEntryLet(exp)) => s"${name} = ${pretty_exp(exp)}\n"
          case (name, BlockEntryDefine(t, exp)) => s"${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"
    }
  }

  def pretty_neutral(neutral: Neutral): String = {
    neutral match {
      case NeutralVar(name: String) =>
        s"${name}"

      case NeutralSwitch(name: String, cases: List[(Value, Value)]) =>
        val s = cases.map {
          case (t, v) => s"${pretty_value(t)} => ${pretty_value(v)}\n"
        }.mkString("")
        s"switch ${name} {${maybe_ln(s)}}"

      case NeutralAp(target: Neutral, arg_list: List[Value]) =>
        val args = arg_list.map {
          case value => pretty_value(value)
        }.mkString(", ")
        s"${pretty_neutral(target)}(${args})"

      case NeutralDot(target: Neutral, field: String) =>
        s"${pretty_neutral(target)}.${field}"
    }
  }

  def pretty_value(value: Value): String = {
    value match {
      case ValueType() =>
        s"type"

      case ValueStrType() =>
        s"string_t"

      case ValueStr(str: String) =>
        val doublequote_char = '"'
        s"${doublequote_char}${str}${doublequote_char}"

      case ValuePi(Telescope(type_map: ListMap[String, Exp], env: Env), return_type: Exp) =>
        var s = type_map.map {
          case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"-> ${pretty_exp(return_type)}\n"
        s"{${maybe_ln(s)}}"

      case ValueFn(Telescope(type_map: ListMap[String, Exp], env: Env), body: Exp) =>
        var s = type_map.map {
          case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"=> ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"

      case ValueCl(
        defined: ListMap[String, (Value, Value)],
        Telescope(type_map: ListMap[String, Exp], env: Env),
      ) =>
        var d = defined.map {
          case (name, (t, value)) => s"${name} : ${pretty_value(t)} = ${pretty_value(value)}\n"
        }.mkString("")
        var s = type_map.map {
          case (name, exp) => s"${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s"class {${maybe_ln(d)}${maybe_ln(s)}}"

      case ValueClInferedFromObj(type_map: ListMap[String, Value]) =>
        var s = type_map.map {
          case (name, value) => s"${name} : ${pretty_value(value)}\n"
        }.mkString("")
        s"class {${maybe_ln(s)}}"

      case ValueObj(value_map: ListMap[String, Value]) =>
        var s = value_map.map {
          case (name, value) => s"${name} = ${pretty_value(value)}\n"
        }.mkString("")
        s"object {${maybe_ln(s)}}"

      case ValueUnion(type_list: List[Value]) =>
        val s = type_list.map {
          case t => s"case ${pretty_value(t)}\n"
        }.mkString("")
        s"union {${maybe_ln(s)}}"

      case neutral: Neutral =>
        pretty_neutral(neutral)
    }
  }
}
