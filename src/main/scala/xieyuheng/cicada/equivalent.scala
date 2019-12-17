package xieyuheng.cicada

import java.util.UUID

import collection.immutable.ListMap

import pretty._

object equivalent {

  def equivalent(ctx: Ctx, s: Val, t: Val): Either[Err, Unit] = {
    val result = (s, t) match {
      case (s: ValType, t: ValType) =>
        Right(())

      case (s: ValPi, t: ValPi) =>
        if (s.arg_type_map.size != t.arg_type_map.size) {
          Left(Err(s"equivalent fail on ValPi, arity mis-match"))
        } else {
          val name_list = s.arg_type_map.keys.zip(t.arg_type_map.keys).map {
            case (s_name, t_name) =>
              val uuid: UUID = UUID.randomUUID()
              s"#equivalent-pi-type:${s_name}:${t_name}:${uuid}"
          }.toList
          for {
            s_force <- util.force_telescope_with_extra_exp(
              name_list, s.arg_type_map, s.return_type, s.env)
            (s_arg_type_map, s_return_type) = s_force
            t_force <- util.force_telescope_with_extra_exp(
              name_list, t.arg_type_map, t.return_type, t.env)
            (t_arg_type_map, t_return_type) = t_force
            _ <- equivalent_list_map(ctx, t_arg_type_map, s_arg_type_map)
            _ <- equivalent(ctx, s_return_type, t_return_type)
          } yield ()
        }

      case (s: ValFn, t: ValFn) =>
        if (s.arg_type_map.size != t.arg_type_map.size) {
          Left(Err(s"equivalent fail on ValFn, arity mis-match"))
        } else {
          val name_list = s.arg_type_map.keys.zip(t.arg_type_map.keys).map {
            case (s_name, t_name) =>
              val uuid: UUID = UUID.randomUUID()
              s"#equivalent-function:${s_name}:${t_name}:${uuid}"
          }.toList
          for {
            s_force <- util.force_telescope_with_extra_exp(
              name_list, s.arg_type_map, s.body, s.env)
            (s_arg_type_map, s_body) = s_force
            t_force <- util.force_telescope_with_extra_exp(
              name_list, t.arg_type_map, t.body, t.env)
            (t_arg_type_map, t_body) = t_force
            _ <- equivalent_list_map(ctx, t_arg_type_map, s_arg_type_map)
            _ <- equivalent(ctx, s_body, t_body)
          } yield ()
        }

      case (s: ValTl, t: ValTl) =>
        // NOTE the order matters
        if (s.type_map.size != t.type_map.size) {
          Left(Err(s"equivalent fail on ValTl, arity mis-match"))
        } else {
          val name_list = s.type_map.keys.zip(t.type_map.keys).map {
            case (s_name, t_name) =>
              val uuid: UUID = UUID.randomUUID()
              s"#equivalent-function:${s_name}:${t_name}:${uuid}"
          }.toList
          for {
            s_type_map <- util.force_telescope(name_list, s.type_map, s.env)
            t_type_map <- util.force_telescope(name_list, t.type_map, t.env)
            _ <- equivalent_list_map(ctx, t_type_map, s_type_map)
          } yield ()
        }

      case (s: ValCl, t: ValCl) =>
        equivalent_list_map(ctx, s.type_map, t.type_map)

      case (s: ValTl, t: ValCl) =>
        val name_list = s.type_map.keys.toList
        for {
          type_map <- util.force_telescope(name_list, s.type_map, s.env)
          _ <- equivalent_list_map(ctx, type_map, t.type_map)
        } yield ()

      case (s: ValCl, t: ValTl) =>
        val name_list = t.type_map.keys.toList
        for {
          type_map <- util.force_telescope(name_list, t.type_map, t.env)
          _ <- equivalent_list_map(ctx, s.type_map, type_map)
        } yield ()

      case (s: ValObj, t: ValObj) =>
        equivalent_list_map(ctx, s.value_map, t.value_map)

      case (s: NeuVar, t: NeuVar) =>
        if (s.name != t.name) {
          Left(Err(
            s"equivalent fail on NeuVar\n" +
              s"${s.name} != ${t.name}\n"
          ))
        } else {
          Right(())
        }

      case (s: NeuAp, t: NeuAp) =>
        for {
          _ <- equivalent(ctx, s.target, t.target)
          _ <- equivalent_list(ctx, s.arg_list, t.arg_list)
        } yield ()

      case (s: NeuDot, t: NeuDot) =>
        if (s.field != t.field) {
          Left(Err(
            s"equivalent fail on NeuDot\n" +
              s"field name mismatch\n" +
              s"${s.field} != ${t.field}\n"
          ))
        } else {
          equivalent(ctx, s.target, t.target)
        }

      case _ =>
        Left(Err(
          s"equivalent fail\n" +
            s"meet unhandled case\n"
        ))
    }

    result.swap.map {
      case err => Err(
        s"equivalent fail\n" +
          s"s: ${pretty_value(s)}\n" +
          s"t: ${pretty_value(t)}\n"
      ).cause(err)
    }.swap
  }

  def equivalent_list(
    ctx: Ctx,
    s_list: List[Val],
    t_list: List[Val],
  ): Either[Err, Unit] = {
    for {
      _ <- util.list_map_maybe_err(s_list.zip(t_list)) {
        case (s, t) =>
          equivalent(ctx, s, t)
      }
    } yield ()
  }

  def equivalent_list_map(
    ctx: Ctx,
    s_list_map: ListMap[String, Val],
    t_list_map: ListMap[String, Val],
  ): Either[Err, Unit] = {
    if (s_list_map.size != t_list_map.size) {
      Left(Err(
        s"equivalent_list_map fail\n" +
          s"length mismatch\n"
      ))
    } else {
      util.list_map_foreach_maybe_err(t_list_map) {
        case (name, t) =>
          s_list_map.get(name) match {
            case Some(s) =>
              equivalent(ctx, s, t)
            case None =>
              Left(Err(
                s"equivalent_list_map fail\n" +
                  s"field name mismatch, field: ${name}\n"
              ))
          }
      }
    }
  }

}
