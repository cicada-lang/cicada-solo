package xieyuheng.cicada

import java.util.UUID

import collection.immutable.ListMap

import pretty._
import subtype._

object equivalent {

  def equivalent(s: Value, t: Value): Unit = {
    try {
      (s, t) match {
        case (s: ValueType, t: ValueType) => ()

        case (s: ValueStrType, t: ValueStrType) => ()

        case (ValueStr(s), ValueStr(t)) =>
          if (s != t) {
            throw Report(List(
              s"equivalent fail between ValueStr and ValueStr\n"
            ))
          }

        // case (s: ValuePi, t: ValuePi) =>
        //   if (s.telescope.type_map.size != t.telescope.type_map.size) {
        //     throw Report(List(
        //       s"equivalent fail between ValuePi and ValuePi, arity mismatch\n"
        //     ))
        //   }
        //   val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
        //     case (s_name, t_name) =>
        //       val uuid: UUID = UUID.randomUUID()
        //       s"#equivalent-pi-type:${s_name}:${t_name}:${uuid}"
        //   }.toList
        //   val (s_type_map, s_return_type) =
        //     util.telescope_force_with_return(s.telescope, name_list, s.return_type)
        //   val (t_type_map, t_return_type) =
        //     util.telescope_force_with_return(t.telescope, name_list, t.return_type)
        //   equivalent_list_map(t_type_map, s_type_map)
        //   equivalent(s_return_type, t_return_type)

        // case (s: ValueFn, t: ValueFn) =>
        //   if (s.telescope.type_map.size != t.telescope.type_map.size) {
        //     throw Report(List(
        //       s"equivalent fail between ValueFn and ValueFn, arity mismatch\n"
        //     ))
        //   }
        //   val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
        //     case (s_name, t_name) =>
        //       val uuid: UUID = UUID.randomUUID()
        //       s"#equivalent-function:${s_name}:${t_name}:${uuid}"
        //   }.toList
        //   val (s_type_map, s_body) =
        //     util.telescope_force_with_return(s.telescope, name_list, s.body)
        //   val (t_type_map, t_body) =
        //     util.telescope_force_with_return(t.telescope, name_list, t.body)
        //   equivalent_list_map(t_type_map, s_type_map)
        //   equivalent(s_body, t_body)

        // case (s: ValueFnCase, t: ValueFnCase) =>
        //   if (s.cases.length != t.cases.length) {
        //     throw Report(List(
        //       s"equivalent fail between ValueFnCase and ValueFnCase, length mismatch\n"
        //     ))
        //   }
        //   s.cases.zip(t.cases).foreach {
        //     case ((s_telescope, s_body), (t_telescope, t_body)) =>
        //       equivalent(ValueFn(s_telescope, s_body), ValueFn(t_telescope, t_body))
        //   }

        // case (s: ValueCl, t: ValueCl) =>
        //   if (s.telescope.type_map.size != t.telescope.type_map.size) {
        //     throw Report(List(
        //       s"equivalent fail between ValueCl and ValueCl, arity mismatch\n"
        //     ))
        //   }
        //   equivalent_defined(s.defined, t.defined)
        //   // NOTE in the following implementation
        //   //   the order matters
        //   val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
        //     case (s_name, t_name) =>
        //       val uuid: UUID = UUID.randomUUID()
        //       s"#equivalent-class:${s_name}:${t_name}:${uuid}"
        //   }.toList
        //   val s_type_map = util.telescope_force(s.telescope, name_list)
        //   val t_type_map = util.telescope_force(t.telescope, name_list)
        //   equivalent_list_map(t_type_map, s_type_map)

        case (s: ValueClInferedFromObj, t: ValueClInferedFromObj) =>
          equivalent_list_map(s.type_map, t.type_map)

        case (s: ValueCl, t: ValueClInferedFromObj) =>
          throw Report(List(
            s"equivalent fail between ValueCl and ValueClInferedFromObj\n" +
              s"this case is not handled\n"
          ))

        case (s: ValueClInferedFromObj, t: ValueCl) =>
          throw Report(List(
            s"equivalent fail between ValueClInferedFromObj and ValueCl\n" +
              s"this case is not handled\n"
          ))

        case (s: ValueObj, t: ValueObj) =>
          equivalent_list_map(s.value_map, t.value_map)

        case (s: NeutralVar, t: NeutralVar) =>
          if (s.name != t.name) {
            throw Report(List(
              s"equivalent fail between NeutralVar and NeutralVar\n" +
                s"${s.name} != ${t.name}\n"
            ))
          }

        case (s: NeutralAp, t: NeutralAp) =>
          equivalent(s.target, t.target)
          equivalent_list(s.arg_list, t.arg_list)

        case (s: NeutralDot, t: NeutralDot) =>
          if (s.field != t.field) {
            throw Report(List(
              s"equivalent fail between NeutralDot and NeutralDot\n" +
                s"field name mismatch\n" +
                s"${s.field} != ${t.field}\n"
            ))
          } else {
            equivalent(s.target, t.target)
          }

        case _ =>
          throw Report(List(
            s"equivalent fail\n" +
              s"meet unhandled case\n"
          ))
      }
    } catch {
      case report: Report =>
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
      throw Report(List(
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
      throw Report(List(
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
            throw Report(List(
              s"equivalent_list_map fail\n" +
                s"can not find field of t_list_map in s_type_map\n" +
                s"field = ${name}\n"
            ))
        }
    }
  }

}
