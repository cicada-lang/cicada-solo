package xieyuheng.cicada

import java.util.UUID

import collection.immutable.ListMap

import eval._
import equivalent._
import pretty._

object subtype {

  def subtype(ctx: Ctx, s: Val, t: Val): Either[Err, Unit] = {
    val result = (s, t) match {
      case (s: ValPi, ValType()) =>
        Right(())

      case (s: ValCl, ValType()) =>
        Right(())

      case (s: ValPi, t: ValPi) =>
        if (s.arg_type_map.size != t.arg_type_map.size) {
          Left(Err(s"subtype fail on ValPi, arity mis-match"))
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

      case (s: ValCl, t: ValCl) =>
        subtype_list_map(ctx, s.type_map, t.type_map)

      case (s, t) =>
        equivalent(ctx, s, t)
    }

    result.swap.map {
      case err => Err(
        s"subtype fail\n" +
          s"s: ${pretty_value(s)}\n" +
          s"t: ${pretty_value(t)}\n"
      ).cause(err)
    }.swap
  }

  def subtype_list_map(
    ctx: Ctx,
    s_map: ListMap[String, Val],
    t_map: ListMap[String, Val],
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
