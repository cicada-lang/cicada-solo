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
          case (name, BlockLet(exp)) => s"let ${name} = ${pretty_exp(exp)}\n"
          case (name, BlockDefine(t, exp)) => s"define ${name} : ${pretty_exp(t)} = ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"return ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"
    }
  }

  def pretty_neu(neu: Neu): String = {
    neu match {
      case NeuVar(name: String) =>
        s"${name}"

      case NeuAp(target: Neu, arg_list: List[Val]) =>
        val args = arg_list.map {
          case value => pretty_value(value)
        }.mkString(", ")
        s"${pretty_neu(target)}(${args})"

      case NeuDot(target: Neu, field: String) =>
        s"${pretty_neu(target)}.${field}"
    }
  }

  def pretty_value(value: Val): String = {
    value match {
      case ValType() =>
        s"type"

      case ValPi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) =>
        var s = arg_type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"conclude ${pretty_exp(return_type)}\n"
        s"{${maybe_ln(s)}}"

      case ValFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) =>
        var s = arg_type_map.map {
          case (name, exp) => s"given ${name} : ${pretty_exp(exp)}\n"
        }.mkString("")
        s = s + s"return ${pretty_exp(body)}\n"
        s"{${maybe_ln(s)}}"

      case ValTl(type_map: ListMap[String, Exp], env: Env) =>
        var s = type_map.map {
          case (name, exp) => s"given ${name} = ${pretty_exp(exp)}\n"
        }.mkString("")
        s"class {${maybe_ln(s)}}"

      case ValCl(type_map: ListMap[String, Val]) =>
        var s = type_map.map {
          case (name, value) => s"given ${name} = ${pretty_value(value)}\n"
        }.mkString("")
        s"class {${maybe_ln(s)}}"

      case ValObj(value_map: ListMap[String, Val]) =>
        var s = value_map.map {
          case (name, value) => s"let ${name} = ${pretty_value(value)}\n"
        }.mkString("")
        s"object {${maybe_ln(s)}}"

      case neu: Neu =>
        pretty_neu(neu)
    }
  }
}
