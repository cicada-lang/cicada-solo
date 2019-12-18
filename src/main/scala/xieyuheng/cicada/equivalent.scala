package xieyuheng.cicada

import java.util.UUID

import collection.immutable.ListMap

import pretty._

object equivalent {

  def equivalent(ctx: Ctx, s: Value, t: Value): Unit = {
    try {
      (s, t) match {
        case (s: ValueType, t: ValueType) => ()

        case (s: ValuePi, t: ValuePi) =>
          if (s.arg_type_map.size != t.arg_type_map.size) {
            throw Report(List(s"equivalent fail on ValuePi, arity mis-match"))
          } else {
            val name_list = s.arg_type_map.keys.zip(t.arg_type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#equivalent-pi-type:${s_name}:${t_name}:${uuid}"
            }.toList
            val (s_arg_type_map, s_return_type) =
              util.force_telescope_with_return(
                name_list, s.arg_type_map, s.return_type, s.env)
            val (t_arg_type_map, t_return_type) =
              util.force_telescope_with_return(
                name_list, t.arg_type_map, t.return_type, t.env)
            equivalent_list_map(ctx, t_arg_type_map, s_arg_type_map)
            equivalent(ctx, s_return_type, t_return_type)
          }

        case (s: ValueFn, t: ValueFn) =>
          if (s.arg_type_map.size != t.arg_type_map.size) {
            throw Report(List(s"equivalent fail on ValueFn, arity mis-match"))
          } else {
            val name_list = s.arg_type_map.keys.zip(t.arg_type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#equivalent-function:${s_name}:${t_name}:${uuid}"
            }.toList
            val (s_arg_type_map, s_body) =
              util.force_telescope_with_return(
                name_list, s.arg_type_map, s.body, s.env)
            val (t_arg_type_map, t_body) =
              util.force_telescope_with_return(
                name_list, t.arg_type_map, t.body, t.env)
            equivalent_list_map(ctx, t_arg_type_map, s_arg_type_map)
            equivalent(ctx, s_body, t_body)
          }

        case (s: ValueTl, t: ValueTl) =>
          // NOTE the order matters
          if (s.type_map.size != t.type_map.size) {
            throw Report(List(s"equivalent fail on ValueTl, arity mis-match"))
          } else {
            val name_list = s.type_map.keys.zip(t.type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#equivalent-function:${s_name}:${t_name}:${uuid}"
            }.toList
            val s_type_map = util.force_telescope(name_list, s.type_map, s.env)
            val t_type_map = util.force_telescope(name_list, t.type_map, t.env)
            equivalent_list_map(ctx, t_type_map, s_type_map)
          }

        case (s: ValueCl, t: ValueCl) =>
          equivalent_list_map(ctx, s.type_map, t.type_map)

        case (s: ValueTl, t: ValueCl) =>
          val name_list = s.type_map.keys.toList
          val type_map = util.force_telescope(name_list, s.type_map, s.env)
          equivalent_list_map(ctx, type_map, t.type_map)

        case (s: ValueCl, t: ValueTl) =>
          val name_list = t.type_map.keys.toList
          val type_map = util.force_telescope(name_list, t.type_map, t.env)
          equivalent_list_map(ctx, s.type_map, type_map)

        case (s: ValueObj, t: ValueObj) =>
          equivalent_list_map(ctx, s.value_map, t.value_map)

        case (s: NeutralVar, t: NeutralVar) =>
          if (s.name != t.name) {
            throw Report(List(
              s"equivalent fail on NeutralVar\n" +
                s"${s.name} != ${t.name}\n"
            ))
          }

        case (s: NeutralAp, t: NeutralAp) =>
          equivalent(ctx, s.target, t.target)
          equivalent_list(ctx, s.arg_list, t.arg_list)

        case (s: NeutralDot, t: NeutralDot) =>
          if (s.field != t.field) {
            throw Report(List(
              s"equivalent fail on NeutralDot\n" +
                s"field name mismatch\n" +
                s"${s.field} != ${t.field}\n"
            ))
          } else {
            equivalent(ctx, s.target, t.target)
          }

        case _ =>
          throw Report(List(
            s"equivalent fail\n" +
              s"meet unhandled case\n"
          ))
      }
    } catch {
      case report: Report =>
        report.prepend(
          s"equivalent fail\n" +
            s"s: ${pretty_value(s)}\n" +
            s"t: ${pretty_value(t)}\n")
    }
  }

  def equivalent_list(
    ctx: Ctx,
    s_list: List[Value],
    t_list: List[Value],
  ): Unit = {
    s_list.zip(t_list).foreach {
      case (s, t) =>
        equivalent(ctx, s, t)
    }
  }

  def equivalent_list_map(
    ctx: Ctx,
    s_list_map: ListMap[String, Value],
    t_list_map: ListMap[String, Value],
  ): Unit = {
    if (s_list_map.size != t_list_map.size) {
      throw Report(List(
        s"equivalent_list_map fail\n" +
          s"length mismatch\n"
      ))
    } else {
      t_list_map.foreach {
        case (name, t) =>
          s_list_map.get(name) match {
            case Some(s) =>
              equivalent(ctx, s, t)
            case None =>
              throw Report(List(
                s"equivalent_list_map fail\n" +
                  s"field name mismatch, field: ${name}\n"
              ))
          }
      }
    }
  }

}
