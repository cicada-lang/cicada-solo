package xieyuheng.cicada

import collection.immutable.ListMap
import scala.util.{ Try, Success, Failure }

import eval._
import infer._
import subtype._
import readback._
import pretty._
import equivalent._

object check {

  def check(env: Env, ctx: Ctx, exp: Exp, t: Value): Unit = {
    try {
      // if it is ok to infer
      // it is also ok to eval
      val s = infer(env, ctx, exp)
      val value = eval(env, exp)
      value match {
        case ValueObj(value_map: ListMap[String, Value]) =>
          t match {
            case cl: ValueCl =>
              defined_check(env, ctx, value_map, cl.defined)
              telescope_check(ctx, value_map, cl.telescope)

            case ValueUnion(type_list: List[Value]) =>
              type_list.find {
                case (t) =>
                  Try {
                    check(env, ctx, exp, t)
                  } match {
                    case Success(()) => true
                    case Failure(_error) => false
                  }
              } match {
                case Some(_t) => ()
                case None =>
                  throw Report(List(
                    s"fail on union type\n"
                  ))
              }

            case _ =>
              throw Report(List(
                s"expecting class type\n" +
                  s"but found: ${pretty_value(t)}\n"
              ))
          }

        case _ =>
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

  def telescope_check(
    ctx: Ctx,
    value_map: ListMap[String, Value],
    telescope: Telescope,
  ): Unit = {
    var local_env = telescope.env
    var local_ctx = ctx
    telescope.type_map.foreach {
      case (name, t_exp) =>
        val t_value = eval(local_env, t_exp)
        val v_value = value_map.get(name) match {
          case Some(v_value) => v_value
          case None =>
            throw Report(List(
              s"telescope_check fail\n" +
                s"can not find a field of class in object\n" +
                s"field: ${name}\n"
            ))
        }
        val v_exp = readback(v_value)
        check(local_env, local_ctx, v_exp, t_value)
        local_env = local_env.ext(name, v_value)
        local_ctx = local_ctx.ext(name, t_value)
    }
  }

  def defined_check(
    env: Env,
    ctx: Ctx,
    value_map: ListMap[String, Value],
    defined: ListMap[String, (Value, Value)],
  ): Unit = {
    defined.foreach {
      case (name, (t_value, defined_value)) =>
        val v_value = value_map.get(name) match {
          case Some(v_value) => v_value
          case None =>
            throw Report(List(
              s"define_check fail\n" +
                s"can not find a field of class in object\n" +
                s"field: ${name}\n"
            ))
        }
        val v_exp = readback(v_value)
        check(env, ctx, v_exp, t_value)
        equivalent(ctx, v_value, defined_value)
    }
  }

}
