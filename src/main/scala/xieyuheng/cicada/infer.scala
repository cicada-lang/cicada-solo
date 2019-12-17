package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import check._
import subtype._
import readback._
import pretty._

object infer {

  def infer(env: Env, ctx: Ctx, exp: Exp): Either[Err, Value] = {
    val result = exp match {
      case Var(name: String) =>
        ctx.lookup_type(name) match {
          case Some(t) => Right(t)
          case None => Left(Err(s"can not find var: ${name} in ctx"))
        }

      case Type() =>
        Right(ValueType())

      case Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(arg_type_map) {
            case (name, exp) =>
              for {
                _ <- check(env, local_ctx, exp, ValueType())
                value <- eval(env, exp)
                _ = {
                  local_ctx = local_ctx.ext(name, value)
                }
              } yield ()
          }
          _ <- check(env, local_ctx, return_type, ValueType())
        } yield ValueType()

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
        }  yield ValuePi(arg_type_map, return_type, env)

      case Cl(type_map: ListMap[String, Exp]) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(type_map) {
            case (name, exp) =>
              for {
                _ <- check(env, local_ctx, exp, ValueType())
                value <- eval(env, exp)
                _ = {
                  local_ctx = local_ctx.ext(name, value)
                }
              } yield ()
          }
        } yield ValueType()

      case Obj(value_map: ListMap[String, Exp]) =>
        for {
          type_map <- util.list_map_map_maybe_err(value_map) {
            case (name, exp) => eval(env, exp)
          }
        }  yield ValueCl(type_map)

      case Ap(target: Exp, arg_list: List[Exp]) =>
        infer(env, ctx, target) match {
          case Right(ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, pi_env: Env)) =>
            val name_list = arg_type_map.keys.toList
            val arg_map = ListMap(name_list.zip(arg_list): _*)
            check_telescope(env, ctx, arg_map, arg_type_map, pi_env).flatMap {
              case (new_env, _new_ctx) =>
                eval(new_env, return_type)
            }
          case Right(ValueType()) =>
            eval(env, target).flatMap {
              case tl: ValueTl =>
                val name_list = tl.type_map.keys.toList
                val arg_map = ListMap(name_list.zip(arg_list): _*)
                check_telescope(env, ctx, arg_map, tl.type_map, tl.env).map {
                  case (_new_env, new_ctx) =>
                    val type_map = new_ctx.type_map.filter {
                      case (name, _t) => tl.type_map.contains(name)
                    }
                    // TODO apply (not partial) a class to its args get a type
                    // we are already returning type here instead of object
                    // this is not enough, since arg_map is known now, we can 
                    ValueCl(type_map)
                }
              case t =>
                Left(Err(s"expecting ValueTl but found: ${t}"))
            }
          case Right(t) =>
            Left(Err(s"expecting ValuePi type but found: ${t}"))
          case Left(err) =>
            Left(err)
        }

      case Dot(target: Exp, field: String) =>
        infer(env, ctx, target) match {
          case Right(ValueCl(type_map: ListMap[String, Value])) =>
            type_map.get(field) match {
              case Some(t) =>
                Right(t)
              case None =>
                Left(Err(s"infer fail, can not find field in dot: ${field}"))
            }
          case Right(t) =>
            Left(Err(s"expecting ValueCl but found: ${t}"))
          case Left(err) =>
            Left(err)
        }

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_ctx = ctx
        for {
          _ <- util.list_map_foreach_maybe_err(block_entry_map) {
            case (name, BlockEntryLet(exp)) => eval(env, exp).map {
              case value =>
                local_ctx = local_ctx.ext(name, value)
            }
            case (name, BlockEntryDefine(_t, exp)) => eval(env, exp).map {
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
