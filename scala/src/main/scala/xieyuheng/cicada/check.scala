package xieyuheng.cicada

import collection.immutable.ListMap
import scala.util.{ Try, Success, Failure }

import pretty._
import evaluate._
import infer._
import subtype._
import equivalent._

object check {

  def check(env: Env, exp: Exp, t: Value): Unit = {
    try {
      exp match {
        case Obj(value_map: ListMap[String, Exp]) =>
          t match {
            case ValueCl(defined, telescope) =>
              // check(env, a1, A1)
              // a1_value = evaluate(env, a1)
              // equivalent(a1_value, d1)
              // ...
              // ------
              // check(
              //   env,
              //   { x1 = a1, x2 = a2, ... },
              //   { x1 = d1 : A1, x2 = d2 : A2, ... })
              defined.foreach {
                case (name, (t_value, d_value)) =>
                  value_map.get(name) match {
                    case Some(v) =>
                      check(env, v, t_value)
                      val v_value = evaluate(env, v)
                      equivalent(v_value, d_value)
                    case None =>
                      throw ErrorReport(List(
                        s"object does not have the field_name of defined: ${name}\n"
                      ))
                  }
              }
              // B1_value = evaluate(telescope_env, B1)
              // check(env, b1, A1_value)
              // b1_value = evaluate(env, b1)
              // telescope_env = telescope_env.ext(y1, B1_value, b1_value)
              // ...
              // ------
              // check(
              //   env,
              //   { y1 = b1, y2 = b2, ... },
              //   { y1 : B1, y2 : B2, ... } @ telescope_env)
              var telescope_env = telescope.env
              telescope.type_map.foreach {
                case (name, t) =>
                  value_map.get(name) match {
                    case Some(v) =>
                      val t_value = evaluate(telescope_env, t)
                      check(env, v, t_value)
                      val v_value = evaluate(env, v)
                      telescope_env = telescope_env.ext(name, t_value, v_value)
                    case None =>
                      throw ErrorReport(List(
                        s"object does not have the field_name of telescope: ${name}\n"
                      ))
                  }
              }

            case _ =>
              throw ErrorReport(List(
                s"expecting class type\n" +
                  s"but found: ${pretty_value(t)}\n"
              ))
          }

        case Fn(type_map: ListMap[String, Exp], body: Exp) =>
          t match {
            case ValuePi(telescope, return_type) =>
              // NOTE free variable proof occurs here
              //   because in `(x1 : A1)`, `x1` is a free variable
              //   it only have type but does not have value
              // subtype(evaluate(local_env, A1), evaluate(telescope_env, B1))
              // unique_var = unique_var_from(x1, y1)
              // local_env = local_env.ext(x1, evaluate(local_env, A1), unique_var)
              // telescope_env = telescope_env.ext(y1, evaluate(local_env, A1), unique_var)
              // ...
              // check(local_env, r, evaluate(telescope_env, R))
              // ------
              // check(
              //   local_env,
              //   { x1 : A1, x2 : A2, ... => r },
              //   { y1 : B1, y2 : B2, ... -> R } @ telescope_env)
              if (type_map.size != telescope.size) {
                throw ErrorReport(List(
                  s"Fn and pi type arity mismatch\n" +
                    s"arity of fn: ${type_map.size}\n" +
                    s"arity of pi: ${telescope.size}\n"
                ))
              }
              var local_env = env
              var telescope_env = telescope.env
              telescope.type_map.zip(type_map).foreach {
                case ((pi_arg_name, pi_arg_type), (fn_arg_name, fn_arg_type)) =>
                  val pi_arg_type_value = evaluate(telescope_env, pi_arg_type)
                  val fn_arg_type_value = evaluate(local_env, fn_arg_type)
                  subtype(fn_arg_type_value, pi_arg_type_value)
                  val unique_var = util.unique_var_from(
                    s"check:Fn:${pi_arg_name}:${fn_arg_name}")
                  local_env = local_env.ext(fn_arg_name, fn_arg_type_value, unique_var)
                  telescope_env = telescope_env.ext(pi_arg_name, pi_arg_type_value, unique_var)
              }

            case _ =>
              throw ErrorReport(List(
                s"expecting pi type\n" +
                  s"but found: ${pretty_value(t)}\n"
              ))
          }

        case FnCase(cases) =>
          t match {
            case ValuePi(telescope, return_type) =>
              cases.foreach {
                case (type_map, body) =>
                  if (type_map.size != telescope.size) {
                    throw ErrorReport(List(
                      s"FnCase and pi type arity mismatch\n" +
                        s"arity of fn: ${type_map.size}\n" +
                        s"arity of pi: ${telescope.size}\n"
                    ))
                  }
                  var local_env = env
                  var telescope_env = telescope.env
                  telescope.type_map.zip(type_map).foreach {
                    case ((pi_arg_name, pi_arg_type), (fn_arg_name, fn_arg_type)) =>
                      val pi_arg_type_value = evaluate(telescope_env, pi_arg_type)
                      val fn_arg_type_value = evaluate(local_env, fn_arg_type)
                      subtype(fn_arg_type_value, pi_arg_type_value)
                      val unique_var = util.unique_var_from(
                        s"check:FnCase:${pi_arg_name}:${fn_arg_name}")
                      local_env = local_env.ext(fn_arg_name, fn_arg_type_value, unique_var)
                      telescope_env = telescope_env.ext(pi_arg_name, pi_arg_type_value, unique_var)
                  }
              }

            case _ =>
              throw ErrorReport(List(
                s"expecting pi type\n" +
                  s"but found: ${pretty_value(t)}\n"
              ))
          }

        case _ =>
          subtype(infer(env, exp), t)
      }
    } catch {
      case report: ErrorReport =>
        report.throw_prepend(
          s"check fail\n" +
            s"exp: ${pretty_exp(exp)}\n" +
            s"value: ${pretty_value(evaluate(env, exp))}\n" +
            s"type: ${pretty_value(t)}\n"
        )
    }
  }

}
