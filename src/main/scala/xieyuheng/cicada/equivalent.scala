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
          if (s.telescope.type_map.size != t.telescope.type_map.size) {
            throw Report(List(
              s"equivalent fail on ValuePi, arity mismatch\n"
            ))
          } else {
            val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#equivalent-pi-type:${s_name}:${t_name}:${uuid}"
            }.toList
            val (s_type_map, s_return_type) =
              util.telescope_force_with_return(s.telescope, name_list, s.return_type)
            val (t_type_map, t_return_type) =
              util.telescope_force_with_return(t.telescope, name_list, t.return_type)
            equivalent_list_map(ctx, t_type_map, s_type_map)
            equivalent(ctx, s_return_type, t_return_type)
          }

        case (s: ValueFn, t: ValueFn) =>
          if (s.telescope.type_map.size != t.telescope.type_map.size) {
            throw Report(List(
              s"equivalent fail on ValueFn, arity mismatch\n"
            ))
          } else {
            val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#equivalent-function:${s_name}:${t_name}:${uuid}"
            }.toList
            val (s_type_map, s_body) =
              util.telescope_force_with_return(s.telescope, name_list, s.body)
            val (t_type_map, t_body) =
              util.telescope_force_with_return(t.telescope, name_list, t.body)
            equivalent_list_map(ctx, t_type_map, s_type_map)
            equivalent(ctx, s_body, t_body)
          }

        case (s: ValueCl, t: ValueCl) =>
          // TODO handle defined fields
          // NOTE the order matters
          if (s.telescope.type_map.size != t.telescope.type_map.size) {
            throw Report(List(
              s"equivalent fail on ValueCl, arity mismatch\n"
            ))
          } else {
            val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#equivalent-function:${s_name}:${t_name}:${uuid}"
            }.toList
            val s_type_map = util.telescope_force(s.telescope, name_list)
            val t_type_map = util.telescope_force(t.telescope, name_list)
            equivalent_list_map(ctx, t_type_map, s_type_map)
          }

        case (s: ValueClAlready, t: ValueClAlready) =>
          equivalent_list_map(ctx, s.type_map, t.type_map)

        case (s: ValueCl, t: ValueClAlready) =>
          // TODO handle defined fields
          // NOTE this can happend only when ValueCl has no defined fields
          //   because this must be a free variable proof

          val name_list = s.telescope.type_map.keys.toList
          val type_map = util.telescope_force(s.telescope, name_list)
          equivalent_list_map(ctx, type_map, t.type_map)

        case (s: ValueClAlready, t: ValueCl) =>
          // TODO handle defined fields
          // NOTE this can happend only when ValueCl has no defined fields
          //   because this must be a free variable proof
          val name_list = t.telescope.type_map.keys.toList
          val type_map = util.telescope_force(t.telescope, name_list)
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
    if (s_list.size != t_list.size) {
      throw Report(List(
        s"equivalent_list fail\n" +
          s"length mismatch\n"
      ))
    } else {
      s_list.zip(t_list).foreach {
        case (s, t) =>
          equivalent(ctx, s, t)
      }
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
