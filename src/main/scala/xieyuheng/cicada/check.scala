package xieyuheng.cicada

import collection.immutable.ListMap

import eval._
import infer._
import subtype._
import pretty._
import equivalent._

object check {

  def check(env: Env, ctx: Ctx, exp: Exp, t: Value): Unit = {
    try {
      exp match {
        case Obj(value_map: ListMap[String, Exp]) =>
          t match {
            case cl: ValueCl =>
              defined_check(env, ctx, value_map, cl.defined)
              telescope_check(env, ctx, value_map, cl.telescope)

            case _ =>
              throw Report(List(
                s"expecting class type but found: ${t}\n"
              ))
          }

        case _ =>
          val s = infer(env, ctx, exp)
          subtype(ctx, s, t)
      }
    } catch {
      case report: Report =>
        report.throw_prepend(
          s"check fail\n" +
            s"exp: ${pretty_exp(exp)}\n" +
            s"t: ${pretty_value(t)}\n"
        )
    }
  }

  def telescope_check_yield_env(
    env: Env,
    ctx: Ctx,
    arg_map: ListMap[String, Exp],
    telescope: Telescope,
  ): Env = {
    var local_env = telescope.env
    var local_ctx = ctx
    telescope.type_map.foreach {
      case (name, t_exp) =>
        val t_value = eval(local_env, t_exp)
        val v_exp = arg_map.get(name) match {
          case Some(v_exp) => v_exp
          case None =>
            throw Report(List(
              s"telescope_check fail\n" +
                s"can not find a field of class in object\n" +
                s"field: ${name}\n"
            ))
        }
        check(local_env, local_ctx, v_exp, t_value)
        // NOTE not using local_env here
        //   local_env is only used to eval types in telescope
        val v_value = eval(env, v_exp)
        local_env = local_env.ext(name, v_value)
        local_ctx = local_ctx.ext(name, t_value)
    }
    local_env
  }

  def telescope_check(
    env: Env,
    ctx: Ctx,
    arg_map: ListMap[String, Exp],
    telescope: Telescope,
  ): Unit = {
    telescope_check_yield_env(env, ctx, arg_map, telescope)
  }

  def defined_check(
    env: Env,
    ctx: Ctx,
    arg_map: ListMap[String, Exp],
    defined: ListMap[String, (Value, Value)],
  ): Unit = {
    defined.foreach {
      case (name, (t_value, v_value)) =>
        val v_exp = arg_map.get(name) match {
          case Some(v_exp) => v_exp
          case None =>
            throw Report(List(
              s"define_check fail\n" +
                s"can not find a field of class in object\n" +
                s"field: ${name}\n"
            ))
        }
        check(env, ctx, v_exp, t_value)
        equivalent(ctx, eval(env, v_exp), v_value)
    }
  }

}
