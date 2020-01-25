package xieyuheng.cicada

import java.util.UUID

import collection.immutable.ListMap

import pretty._
import evaluate._
import subtype._

object equivalent {

  def equivalent(s: Value, t: Value): Unit = {
    try {
      (s, t) match {
        case (s: ValueType, t: ValueType) => ()

        case (s: ValueStrType, t: ValueStrType) => ()

        case (ValueStr(s), ValueStr(t)) =>
          if (s != t) {
            throw ErrorReport(List(
              s"equivalent fail between ValueStr and ValueStr\n"
            ))
          }

        case (s: ValuePi, t: ValuePi) =>
          if (s.telescope.size != t.telescope.size) {
            throw ErrorReport(List(
              s"equivalent fail between ValuePi and ValuePi\n" +
                s"telescope size mismatch\n" +
                s"s.telescope.size = ${s.telescope.size}\n" +
                s"t.telescope.size = ${t.telescope.size}\n"
            ))
          }
          var t_telescope_env = t.telescope.env
          var s_telescope_env = s.telescope.env
          t.telescope.type_map.zip(s.telescope.type_map).foreach {
            case ((t_name, t_type), (s_name, s_type)) =>
              val t_type_value = evaluate(t_telescope_env, t_type)
              val s_type_value = evaluate(s_telescope_env, s_type)
              equivalent(s_type_value, t_type_value)
              val unique_var = util.unique_var_from(
                s"equivalent:ValuePi:ValuePi:${s_name}${t_name}")
              t_telescope_env = t_telescope_env.ext(unique_var.name, t_type_value, unique_var)
              s_telescope_env = s_telescope_env.ext(unique_var.name, s_type_value, unique_var)
          }
          val t_return_type_value = evaluate(t_telescope_env, t.return_type)
          val s_return_type_value = evaluate(s_telescope_env, s.return_type)
          equivalent(s_return_type_value, t_return_type_value)

        case (s: ValueFn, t: ValueFn) =>
          if (s.telescope.size != t.telescope.size) {
            throw ErrorReport(List(
              s"equivalent fail between ValueFn and ValueFn\n" +
                s"telescope size mismatch\n" +
                s"s.telescope.size = ${s.telescope.size}\n" +
                s"t.telescope.size = ${t.telescope.size}\n"
            ))
          }
          var t_telescope_env = t.telescope.env
          var s_telescope_env = s.telescope.env
          t.telescope.type_map.zip(s.telescope.type_map).foreach {
            case ((t_name, t_type), (s_name, s_type)) =>
              val t_type_value = evaluate(t_telescope_env, t_type)
              val s_type_value = evaluate(s_telescope_env, s_type)
              equivalent(s_type_value, t_type_value)
              val unique_var = util.unique_var_from(
                s"equivalent:ValuePi:ValuePi:${s_name}${t_name}")
              t_telescope_env = t_telescope_env.ext(unique_var.name, t_type_value, unique_var)
              s_telescope_env = s_telescope_env.ext(unique_var.name, s_type_value, unique_var)
          }
          val t_body_value = evaluate(t_telescope_env, t.body)
          val s_body_value = evaluate(s_telescope_env, s.body)
          equivalent(s_body_value, t_body_value)

        case (s: ValueFnCase, t: ValueFnCase) =>
          if (s.cases.length != t.cases.length) {
            throw ErrorReport(List(
              s"equivalent fail between ValueFnCase and ValueFnCase\n" +
                s"cases length mismatch\n" +
                s"s.cases.length = ${s.cases.length}\n" +
                s"t.cases.length = ${t.cases.length}\n"
            ))
          }
          s.cases.zip(t.cases).foreach {
            case ((s_telescope, s_body), (t_telescope, t_body)) =>
              equivalent(ValueFn(s_telescope, s_body), ValueFn(t_telescope, t_body))
          }

        case (s: ValueCl, t: ValueCl) =>
          equivalent_defined(s.defined, t.defined)
          if (s.telescope.size != t.telescope.size) {
            throw ErrorReport(List(
              s"equivalent fail between ValueCl and ValueCl\n" +
                s"telescope size mismatch\n" +
                s"s.telescope.size = ${s.telescope.size}\n" +
                s"t.telescope.size = ${t.telescope.size}\n"
            ))
          }
          var t_telescope_env = t.telescope.env
          var s_telescope_env = s.telescope.env
          t.telescope.type_map.foreach {
            case (name, t_type) =>
              s.telescope.type_map.get(name) match {
                case Some(s_type) =>
                  val t_type_value = evaluate(t_telescope_env, t_type)
                  val s_type_value = evaluate(s_telescope_env, s_type)
                  equivalent(s_type_value, t_type_value)
                  t_telescope_env = t_telescope_env.ext(name, t_type_value, NeutralVar(name))
                  s_telescope_env = s_telescope_env.ext(name, s_type_value, NeutralVar(name))
                case None =>
                  throw ErrorReport(List(
                    s"equivalent_telescope fail\n" +
                      s"can not find field_name of t_telescope in s_telescope\n" +
                      s"field_name = ${name}\n"
                  ))
              }
          }

        case (s: ValueObj, t: ValueObj) =>
          equivalent_list_map(s.value_map, t.value_map)

        case (s: NeutralVar, t: NeutralVar) =>
          if (s.name != t.name) {
            throw ErrorReport(List(
              s"equivalent fail between NeutralVar and NeutralVar\n" +
                s"${s.name} != ${t.name}\n"
            ))
          }

        case (s: NeutralAp, t: NeutralAp) =>
          equivalent(s.target, t.target)
          equivalent_list(s.args, t.args)

        case (s: NeutralDot, t: NeutralDot) =>
          if (s.field_name != t.field_name) {
            throw ErrorReport(List(
              s"equivalent fail between NeutralDot and NeutralDot\n" +
                s"field_name name mismatch\n" +
                s"${s.field_name} != ${t.field_name}\n"
            ))
          } else {
            equivalent(s.target, t.target)
          }

        case _ =>
          throw ErrorReport(List(
            s"equivalent fail\n" +
              s"meet unhandled case\n"
          ))
      }
    } catch {
      case report: ErrorReport =>
        report.throw_prepend(
          s"equivalent fail\n" +
            s"s: ${pretty_value(s)}\n" +
            s"t: ${pretty_value(t)}\n")
    }
  }

  def equivalent_list(
    s_list: List[Value],
    t_list: List[Value],
  ): Unit = {
    if (s_list.length != t_list.length) {
      throw ErrorReport(List(
        s"equivalent_list fail\n" +
          s"list length mismatch\n" +
          s"s_list.length = ${s_list.length}\n" +
          s"t_list.length = ${t_list.length}\n"
      ))
    }
    s_list.zip(t_list).foreach {
      case (s, t) => equivalent(s, t)
    }
  }

  def equivalent_list_map(
    s_list_map: ListMap[String, Value],
    t_list_map: ListMap[String, Value],
  ): Unit = {
    if (s_list_map.size != s_list_map.size) {
      throw ErrorReport(List(
        s"equivalent_list_map fail\n" +
          s"list_map size mismatch\n" +
          s"s_list_map.size = ${s_list_map.size}\n" +
          s"t_list_map.size = ${t_list_map.size}\n"
      ))
    }
    t_list_map.foreach {
      case (name, t_value) =>
        s_list_map.get(name) match {
          case Some(s_value) =>
            equivalent(s_value, t_value)
          case None =>
            throw ErrorReport(List(
              s"equivalent_list_map fail\n" +
                s"can not find field_name of t_list_map in s_type_map\n" +
                s"field_name = ${name}\n"
            ))
        }
    }
  }

  def equivalent_defined(
    s_defined: ListMap[String, (Value, Value)],
    t_defined: ListMap[String, (Value, Value)],
  ): Unit = {
    if (s_defined.size != t_defined.size) {
      throw ErrorReport(List(
        s"equivalent_defined fail\n" +
          s"defined size mismatch\n" +
          s"s_defined.size = ${s_defined.size}\n" +
          s"t_defined.size = ${t_defined.size}\n"
      ))
    }
    t_defined.foreach {
      case (name, (t_type_value, t_value)) =>
        s_defined.get(name) match {
          case Some((s_type_value, s_value)) =>
            equivalent(s_type_value, t_type_value)
            equivalent(s_value, t_value)
          case None =>
            throw ErrorReport(List(
              s"equivalent_defined fail\n" +
                s"can not find field_name of t_defined in s_defined\n" +
                s"field_name = ${name}\n"
            ))
        }
    }
  }

}
