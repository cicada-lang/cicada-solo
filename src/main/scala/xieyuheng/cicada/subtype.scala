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
        // NOTE the following cases means that
        //   `type` is the universe of all objects and types.
        case (s: ValuePi, ValueType()) => ()
        case (s: ValueCl, ValueType()) => ()
        case (s: ValueStrType, ValueType()) => ()

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

        case (s: ValueCl, t: ValueCl) =>
          subtype_defined_list_map(
            ctx,
            s.defined, util.telescope_force(s.telescope, s.telescope.name_list),
            t.defined, util.telescope_force(t.telescope, t.telescope.name_list))

        case (s, t) =>
          equivalent(ctx, s, t)
      }
    } catch {
      case report: Report =>
        report.throw_prepend(
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

  def subtype_defined_list_map(
    ctx: Ctx,
    s_defined: ListMap[String, (Value, Value)], s_map: ListMap[String, Value],
    t_defined: ListMap[String, (Value, Value)], t_map: ListMap[String, Value],
  ): Unit = {
    t_defined.foreach {
      case (name, (t, v)) =>
        s_defined.get(name) match {
          case Some((s, u)) =>
            subtype(ctx, s, t)
            equivalent(ctx, u, v)
          case None =>
            throw Report(List(
              s"subtype_defined can not find field: ${name}\n"
            ))
        }
    }
    t_map.foreach {
      case (name, t) =>
        s_map.get(name) match {
          case Some(s) =>
            subtype(ctx, s, t)
          case None =>
            s_defined.get(name) match {
              case Some((s, _u)) =>
                subtype(ctx, s, t)
              case None =>
                throw Report(List(
                  s"subtype_defined_list_map can not find field: ${name}\n"
                ))
            }
        }
    }
  }

}
