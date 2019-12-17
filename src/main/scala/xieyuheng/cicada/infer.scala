package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import check._
import subtype._
import readback._
import pretty._

object infer {

  def infer(env: Env, ctx: Ctx, exp: Exp): Either[Err, Val] = {
    val result = exp match {
      case Var(name: String) =>
        ctx.lookup_type(name) match {
          case Some(t) => Right(t)
          case None => Left(Err(s"can not find var: ${name} in ctx"))
        }

      case Type() =>
        Right(ValType())

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(arg_type_map) {
            case (name, exp) =>
              for {
                _ <- check(env, local_ctx, exp, ValType())
                value <- eval(env, exp)
                _ = {
                  local_ctx = local_ctx.ext(name, value)
                }
              } yield ()
          }
          _ <- check(env, local_ctx, return_type, ValType())
        } yield ValType()

      case Fn(arg_type_map: ListMap[String, Exp], body: Exp) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(arg_type_map) {
            case (name, exp) => eval(env, exp).map {
              case value =>
                local_ctx = local_ctx.ext(name, value)
            }
          }
          return_type_value <- infer(env, local_ctx, body)
          return_type <- readback(return_type_value)
        }  yield ValPi(arg_type_map, return_type, env)

      case Cl(type_map: ListMap[String, Exp]) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(type_map) {
            case (name, exp) =>
              for {
                _ <- check(env, local_ctx, exp, ValType())
                value <- eval(env, exp)
                _ = {
                  local_ctx = local_ctx.ext(name, value)
                }
              } yield ()
          }
        } yield ValType()

      case Obj(value_map: ListMap[String, Exp]) =>
        for {
          type_map <- util.list_map_map_maybe_err(value_map) {
            case (name, exp) => eval(env, exp)
          }
        }  yield ValCl(type_map)

      case Ap(target: Exp, arg_list: List[Exp]) =>
        infer(env, ctx, target) match {
          case Right(ValPi(arg_type_map: ListMap[String, Exp], return_type: Exp, pi_env: Env)) =>
            val name_list = arg_type_map.keys.toList
            val arg_map = ListMap(name_list.zip(arg_list): _*)
            check_telescope(env, ctx, arg_map, arg_type_map, pi_env).flatMap {
              case (new_env, _new_ctx) =>
                eval(new_env, return_type)
            }
          case Right(ValType()) =>
            eval(env, target).flatMap {
              case tl: ValTl =>
                val name_list = tl.type_map.keys.toList
                val arg_map = ListMap(name_list.zip(arg_list): _*)
                check_telescope(env, ctx, arg_map, tl.type_map, tl.env).map {
                  case (_new_env, new_ctx) =>
                    val type_map = new_ctx.type_map.filter {
                      case (name, _t) => tl.type_map.contains(name)
                    }
                    ValCl(type_map)
                }
              case t =>
                Left(Err(s"expecting ValTl but found: ${t}"))
            }
          case Right(t) =>
            Left(Err(s"expecting ValPi type but found: ${t}"))
          case Left(err) =>
            Left(err)
        }

      case Dot(target: Exp, field: String) =>
        infer(env, ctx, target) match {
          case Right(ValCl(type_map: ListMap[String, Val])) =>
            type_map.get(field) match {
              case Some(t) =>
                Right(t)
              case None =>
                Left(Err(s"infer fail, can not find field in dot: ${field}"))
            }
          case Right(t) =>
            Left(Err(s"expecting ValCl but found: ${t}"))
          case Left(err) =>
            Left(err)
        }

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(block_entry_map) {
            case (name, BlockLet(exp)) => eval(env, exp).map {
              case value =>
                local_ctx = local_ctx.ext(name, value)
            }
            case (name, BlockDefine(_t, exp)) => eval(env, exp).map {
              case value =>
                local_ctx = local_ctx.ext(name, value)
            }
          }
          result <- infer(env, local_ctx, body)
        } yield result
    }

    result.swap.map {
      case err => Err(
        s"infer fail\n" +
          s"exp: ${pretty_exp(exp)}\n"
      ).cause(err)
    }.swap
  }

}
