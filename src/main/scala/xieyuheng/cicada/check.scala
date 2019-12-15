package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import infer._
import subtype._
import pretty._

object check {

  def check(env: Env, ctx: Ctx, exp: Exp, t: Val): Either[Err, Unit] = {
    val result = exp match {
      case Obj(value_map: ListMap[String, Exp]) =>
        t match {
          case tl: ValTl =>
            check_telescope(env, ctx, value_map, tl.type_map, tl.env)
              .map { case _ => () }

          case _ =>
            Left(Err(s"expecting class type but found: ${t}"))
        }

      case _ =>
        for {
          s <- infer(env, ctx, exp)
          _ <- subtype(ctx, s, t)
        } yield ()
    }

    result.swap.map {
      case err => Err(
        s"check fail\n" +
          s"exp: ${pretty_exp(exp)}\n" +
          s"t: ${pretty_value(t)}\n"
      ).cause(err)
    }.swap
  }

  def check_telescope(
    env: Env,
    ctx: Ctx,
    arg_exp_map: ListMap[String, Exp],
    type_map: ListMap[String, Exp],
    init_telescope_env: Env,
  ): Either[Err, (Env, Ctx)] = {
    var local_env = init_telescope_env
    var local_ctx = ctx
    util.list_map_foreach_maybe_err(type_map) {
      case (name, t_exp) =>
        for {
          t_value <- eval(local_env, t_exp)
          v_exp <- {
            arg_exp_map.get(name) match {
              case Some(v_exp) =>
                Right(v_exp)
              case None =>
                Left(Err(
                  s"check_telescope fail, can not find a field of object in class, field: ${name}"
                ))
            }
          }
          result <- check(local_env, local_ctx, v_exp, t_value)
          v_value <- eval(env, v_exp)
          _ = {
            local_env = local_env.ext(name, v_value)
            local_ctx = local_ctx.ext(name, t_value)
          }
        } yield result
    }.map {
      case _ok => (local_env, local_ctx)
    }
  }

}
