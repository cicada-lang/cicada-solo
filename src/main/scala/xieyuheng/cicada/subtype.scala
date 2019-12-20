package xieyuheng.cicada

import java.util.UUID

import collection.immutable.ListMap

import eval._
import equivalent._
import pretty._

object subtype {

  def subtype(ctx: Ctx, s: Value, t: Value): Unit = {
    try {
      (s, t) match {
        case (s: ValuePi, ValueType()) => ()

        case (s: ValueClAlready, ValueType()) => ()

        case (s: ValuePi, t: ValuePi) =>
          if (s.telescope.type_map.size != t.telescope.type_map.size) {
            throw Report(List(
              s"subtype fail on ValuePi, arity mismatch"
            ))
          } else {
            val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#subtype-pi-type:${s_name}:${t_name}:${uuid}"
            }.toList
            val (s_type_map, s_return_type) =
              util.telescope_force_with_return(s.telescope, name_list, s.return_type)
            val (t_type_map, t_return_type) =
              util.telescope_force_with_return(t.telescope, name_list, t.return_type)
            subtype_list_map(ctx, t_type_map, s_type_map)
            subtype(ctx, s_return_type, t_return_type)
          }

        case (s: ValueClAlready, t: ValueClAlready) =>
          subtype_list_map(ctx, s.type_map, t.type_map)

        case (s: ValueCl, t: ValueCl) =>
          // TODO
          ???

        case (s: ValueCl, t: ValueClAlready) =>
          // TODO
          val name_list = s.telescope.type_map.keys.toList
          val type_map = util.telescope_force(s.telescope, name_list)
          subtype_list_map(ctx, type_map, t.type_map)

        case (s: ValueClAlready, t: ValueCl) =>
          // NOTE this can happend only when ValueCl has no defined fields
          //   because this must be a free variable proof
          // TODO
          val name_list = t.telescope.type_map.keys.toList
          val type_map = util.telescope_force(t.telescope, name_list)
          subtype_list_map(ctx, s.type_map, type_map)

        case (s, t) =>
          equivalent(ctx, s, t)
      }
    } catch {
      case report: Report =>
        report.prepend(
          s"subtype fail\n" +
            s"s: ${pretty_value(s)}\n" +
            s"t: ${pretty_value(t)}\n")
    }
  }

  def subtype_list_map(
    ctx: Ctx,
    s_map: ListMap[String, Value],
    t_map: ListMap[String, Value],
  ): Unit = {
    t_map.foreach {
      case (name, t) =>
        s_map.get(name) match {
          case Some(s) =>
            subtype(ctx, s, t)
          case None =>
            throw Report(List(
              s"subtype_list_map can not find field: ${name}\n"
            ))
        }
    }
  }

}
