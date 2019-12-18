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

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        var s = arg_type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"conclude ${pretty_exp(return_type)}\n"
        s"{${maybe_ln(s)}}"

      case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
        var s = arg_type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"return ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"

      case Ap(target: Exp, arg_list: List[Exp]) =>
        val args = arg_list.map {
          case exp => pretty_exp(exp)
        }.mkString(", ")
        s"${pretty_exp(target)}(${args})"

      case Cl(type_map: ListMap[String, Exp]) =>
        var s = type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s"class {${maybe_ln(s)}}"

      case Obj(value_map: ListMap[String, Exp]) =>
        var s = value_map.map {
          case (name, exp) => s"let ${name} = ${pretty_exp(exp)}\n"
        }.mkString("")
        s"object {${maybe_ln(s)}}"

      case Dot(target: Exp, field: String) =>
        s"${pretty_exp(target)}.${field}"

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var s = block_entry_map.map {
          case (name, BlockEntryLet(exp)) => s"let ${name} = ${pretty_exp(exp)}\n"
          case (name, BlockEntryDefine(t, exp)) => s"define ${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"return ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"
    }
  }

  def pretty_neutral(neutral: Neutral): String = {
    neutral match {
      case NeutralVar(name: String) =>
        s"${name}"

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

      case ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) =>
        var s = arg_type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"conclude ${pretty_exp(return_type)}\n"
        s"{${maybe_ln(s)}}"

      case ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) =>
        var s = arg_type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"return ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"

      case ValueTl(type_map: ListMap[String, Exp], env: Env) =>
        var s = type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s"class {${maybe_ln(s)}}"

      case ValueCl(type_map: ListMap[String, Value]) =>
        var s = type_map.map {
          case (name, value) => s"given ${name} : ${pretty_value(value)}\n"
        }.mkString("")
        s"class {${maybe_ln(s)}}"

      case ValueObj(value_map: ListMap[String, Value]) =>
        var s = value_map.map {
          case (name, value) => s"let ${name} = ${pretty_value(value)}\n"
        }.mkString("")
        s"object {${maybe_ln(s)}}"

      case neutral: Neutral =>
        pretty_neutral(neutral)
    }
  }
}
