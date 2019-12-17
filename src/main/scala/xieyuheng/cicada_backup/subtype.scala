package xieyuheng.cicada_backup

import java.util.UUID

import collection.immutable.ListMap

import eval._
import equivalent._
import pretty._

object subtype {

  def subtype(ctx: Ctx, s: Value, t: Value): Either[Err, Unit] = {
    val result = (s, t) match {
      case (s: ValuePi, ValueType()) =>
        Right(())

      case (s: ValueCl, ValueType()) =>
        Right(())

      case (s: ValuePi, t: ValuePi) =>
        if (s.arg_type_map.size != t.arg_type_map.size) {
          Left(Err(s"subtype fail on ValuePi, arity mis-match"))
        } else {
          val name_list = s.arg_type_map.keys.zip(t.arg_type_map.keys).map {
            case (s_name, t_name) =>
              val uuid: UUID = UUID.randomUUID()
              s"#subtype-pi-type:${s_name}:${t_name}:${uuid}"
          }.toList
          for {
            s_force <- util.force_telescope_with_extra_exp(
              name_list, s.arg_type_map, s.return_type, s.env)
            (s_arg_type_map, s_return_type) = s_force
            t_force <- util.force_telescope_with_extra_exp(
              name_list, t.arg_type_map, t.return_type, t.env)
            (t_arg_type_map, t_return_type) = t_force
            _ <- subtype_list_map(ctx, t_arg_type_map, s_arg_type_map)
            _ <- subtype(ctx, s_return_type, t_return_type)
          } yield ()
        }

      case (s: ValueCl, t: ValueCl) =>
        subtype_list_map(ctx, s.type_map, t.type_map)

      case (s: ValueTl, t: ValueCl) =>
        val name_list = s.type_map.keys.toList
        for {
          type_map <- util.force_telescope(name_list, s.type_map, s.env)
          _ <- subtype_list_map(ctx, type_map, t.type_map)
        } yield ()

      case (s: ValueCl, t: ValueTl) =>
        val name_list = t.type_map.keys.toList
        for {
          type_map <- util.force_telescope(name_list, t.type_map, t.env)
          _ <- subtype_list_map(ctx, s.type_map, type_map)
        } yield ()

      case (s, t) =>
        equivalent(ctx, s, t)
    }

//     result.swap.map {
//       case err => Err(
//         s"subtype fail\n" +
//           s"s: ${pretty_value(s)}\n" +
//           s"t: ${pretty_value(t)}\n"
//       ).cause(err)
//     }.swap

    result.swap.map {
      case err => Err(
        s"subtype fail\n" +
          s"s: ${s}\n" +
          s"t: ${t}\n"
      ).cause(err)
    }.swap
  }

  def subtype_list_map(
    ctx: Ctx,
    s_map: ListMap[String, Value],
    t_map: ListMap[String, Value],
  ): Either[Err, Unit] = {
    util.list_map_foreach_maybe_err(t_map) {
      case (name, t) =>
        s_map.get(name) match {
          case Some(s) =>
            subtype(ctx, s, t)
          case None =>
            Left(Err(s"subtype_list_map can not find field: ${name}"))
        }
    }
  }

}
