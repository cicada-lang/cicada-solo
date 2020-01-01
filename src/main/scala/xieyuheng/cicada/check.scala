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

      t match {
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

        case t =>
          exp match {
            // TODO var should be handle in infer
            //   but fail to @accept true : union { case true_t case false_t }
            //   if var is not handle in check
            case Var(name: String) =>
              env.lookup_value(name) match {
                case Some(value) =>
                  check(env, ctx, readback(value), t)
                case None =>
                  subtype(infer(env, ctx, exp), t)
              }

            // TODO should combine the following rules
            // CASE without defined
            // [check] env |- a1 : eval(env1, A1)
            // [check] env + (x1 = a1 : A1) |- a2 : eval(env1 + (x1 = a1 : A1), A2)
            // [check] ...
            // ------------
            // [check] env |- { x1 = a1, x2 = a2, ... } : { x1 : A1, x2 : A2, ... } @ env1
            // NOTE env1 + (x1 = a1 : A1)
            //   should be
            //      env1 + (x1 = eval(env, a1) : env1(env1, A1))
            // CASE with defined
            // [check] env |- a1 : A1
            // [equal] eval(env, a1) = d1
            // [check] env + (x1 = a1 : A1) |- a2 : A2
            // [equal] eval(env + (x1 = a1 : A1), a2) = d2
            // [check] ...
            // [equal] ...
            // ------------
            // [check] env |- { x1 = a1, x2 = a2, ... } : { x1 = d1 : A1, x2 = d2 : A2, ... }
            // [check] env |- { x1 = a1, x2 = a2, ... }
            //              : { x1 = d1 : A1
            //                  x2 = d2 : A2
            //                  ...
            //                  y1 : A1, y2 : A2, ... } @ env1
            case Obj(value_map: ListMap[String, Exp]) =>
              t match {
                case cl: ValueCl =>
                  val v_map = value_map.map {
                    case (name, exp) => (name, eval(env, exp))
                  }
                  defined_check(env, ctx, v_map, cl.defined)
                  // TODO the following ctx should use defined_check
                  telescope_check(ctx, v_map, cl.telescope)

                case _ =>
                  throw Report(List(
                    s"expecting class type\n" +
                      s"but found: ${pretty_value(t)}\n"
                  ))
              }

            // NOTE free variable proof occurs here
            //   because in `env + (x1 : A1)`, `x1` is a free variable
            //   it only have type but does not have value
            // [subtype] eval(env, A1) <: eval(env1, B1)
            // [subtype] eval(env + (x1 : A1), A2) <: eval(env1 + (y1 : A1), B2)
            // [subtype] ...
            // [check] env + (x1 : A1, x2 : A2, ...), ctx |-
            //   r : eval(env1 + (y1 : A1, y2 : A2, ...), R)
            // ------------
            // [check] env |- { x1 : A1, x2 : A2, ... => r }
            //              : { y1 : B1, y2 : B2, ... -> R } @ env1
            case Fn(type_map: ListMap[String, Exp], body: Exp) =>
              t match {
                case pi: ValuePi =>
                  val (t_map, return_type_value) =
                    util.telescope_force_with_return(
                      pi.telescope,
                      pi.telescope.name_list,
                      pi.return_type)
                  var local_ctx = ctx
                  type_map.zipWithIndex.foreach {
                    case ((name, exp), index) =>
                      check(env, local_ctx, exp, ValueType())
                      val s = eval(env, exp)
                      val (_name, t) = t_map.toList(index)
                      subtype(s, t)
                      local_ctx = local_ctx.ext(name, s)
                  }
                  check(env, local_ctx, body, return_type_value)

                case _ =>
                  throw Report(List(
                    s"expecting pi type\n" +
                      s"but found: ${pretty_value(t)}\n"
                  ))
              }

            case FnCase(cases) =>
              cases.foreach {
                case (type_map, body) =>
                  t match {
                    case pi: ValuePi =>
                      val (t_map, return_type_value) =
                        util.telescope_force_with_return(
                          pi.telescope,
                          pi.telescope.name_list,
                          pi.return_type)
                      var local_ctx = ctx
                      type_map.zipWithIndex.foreach {
                        case ((name, exp), index) =>
                          check(env, local_ctx, exp, ValueType())
                          val s = eval(env, exp)
                          val (_name, t) = t_map.toList(index)
                          subtype(s, t)
                          local_ctx = local_ctx.ext(name, s)
                      }
                      check(env, local_ctx, body, return_type_value)

                    case _ =>
                      throw Report(List(
                        s"expecting pi type\n" +
                          s"but found: ${pretty_value(t)}\n"
                      ))
                  }
              }

            case _ =>
              subtype(infer(env, ctx, exp), t)
          }
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
        equivalent(v_value, defined_value)
    }
  }

}
