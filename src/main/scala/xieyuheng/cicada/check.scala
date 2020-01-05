package xieyuheng.cicada

import collection.immutable.ListMap
import scala.util.{ Try, Success, Failure }

import pretty._
import eval._
import infer._
import subtype._
import readback._
import equivalent._

object check {

  def check(env: Env, exp: Exp, t: Value): Unit = {
    try {
      exp match {
        case Obj(value_map: ListMap[String, Exp]) =>
          t match {
            case ValueCl(defined, telescope) =>
              // [check] local_env |- a1 : A1
              // a1_value = eval(local_env, a1)
              // [equal] a1_value = d1
              // local_env = local_env.ext(x1, A1, a1_value)
              // ...
              // ------------
              // [check] local_env |- { x1 = a1, x2 = a2, ... }
              //                    : { x1 = d1 : A1, x2 = d2 : A2, ... }
              var local_env = env
              defined.foreach {
                case (name, (d_value, t_value)) =>
                  value_map.get(name) match {
                    case Some(v) =>
                      check(local_env, v, t_value)
                      val v_value = eval(local_env, v)
                      equivalent(v_value, d_value)
                      local_env = local_env.ext(name, t_value, v_value)
                    case None =>
                      throw Report(List(
                        s"object does not have the field of defined: ${name}\n"
                      ))
                  }
              }
              // A1_value = eval(telescope_env, A1)
              // [check] local_env |- a1 : A1_value
              // a1_value = eval(local_env, a1)
              // local_env = local_env.ext(x1, a1_value, A1_value)
              // telescope_env = telescope_env.ext(x1, a1_value, A1_value)
              // ...
              // ------------
              // [check] local_env |- { x1 = a1, x2 = a2, ... }
              //                    : { x1 : A1, x2 : A2, ... } @ telescope_env
              var telescope_env = telescope.env
              telescope.type_map.foreach {
                case (name, t) =>
                  value_map.get(name) match {
                    case Some(v) =>
                      val t_value = eval(telescope_env, t)
                      check(local_env, v, t_value)
                      val v_value = eval(local_env, v)
                      local_env = local_env.ext(name, t_value, v_value)
                      telescope_env = telescope_env.ext(name, t_value, v_value)
                    case None =>
                      throw Report(List(
                        s"object does not have the field of telescope: ${name}\n"
                      ))
                  }
              }

            case _ =>
              throw Report(List(
                s"expecting class type\n" +
                  s"but found: ${pretty_value(t)}\n"
              ))
          }

//         // NOTE free variable proof occurs here
//         //   because in `env + (x1 : A1)`, `x1` is a free variable
//         //   it only have type but does not have value
//         // [subtype] eval(env, A1) <: eval(env1, B1)
//         // [subtype] eval(env + (x1 : A1), A2) <: eval(env1 + (y1 : A1), B2)
//         // [subtype] ...
//         // [check] env + (x1 : A1, x2 : A2, ...), ctx |-
//         //   r : eval(env1 + (y1 : A1, y2 : A2, ...), R)
//         // ------------
//         // [check] env |- { x1 : A1, x2 : A2, ... => r }
//         //              : { y1 : B1, y2 : B2, ... -> R } @ env1
//         case Fn(type_map: ListMap[String, Exp], body: Exp) =>
//           t match {
//             case pi: ValuePi =>
//               val (t_map, return_type_value) =
//                 util.telescope_force_with_return(
//                   pi.telescope,
//                   pi.telescope.name_list,
//                   pi.return_type)
//               var local_ctx = ctx
//               type_map.zipWithIndex.foreach {
//                 case ((name, exp), index) =>
//                   check(env, local_ctx, exp, ValueType())
//                   val s = eval(env, exp)
//                   val (_name, t) = t_map.toList(index)
//                   subtype(s, t)
//                   local_ctx = local_ctx.ext(name, s)
//               }
//               check(env, local_ctx, body, return_type_value)

//             case _ =>
//               throw Report(List(
//                 s"expecting pi type\n" +
//                   s"but found: ${pretty_value(t)}\n"
//               ))
//           }

//         case FnCase(cases) =>
//           cases.foreach {
//             case (type_map, body) =>
//               t match {
//                 case pi: ValuePi =>
//                   val (t_map, return_type_value) =
//                     util.telescope_force_with_return(
//                       pi.telescope,
//                       pi.telescope.name_list,
//                       pi.return_type)
//                   var local_ctx = ctx
//                   type_map.zipWithIndex.foreach {
//                     case ((name, exp), index) =>
//                       check(env, local_ctx, exp, ValueType())
//                       val s = eval(env, exp)
//                       val (_name, t) = t_map.toList(index)
//                       subtype(s, t)
//                       local_ctx = local_ctx.ext(name, s)
//                   }
//                   check(env, local_ctx, body, return_type_value)

//                 case _ =>
//                   throw Report(List(
//                     s"expecting pi type\n" +
//                       s"but found: ${pretty_value(t)}\n"
//                   ))
//               }
//           }

        case _ =>
          subtype(infer(env, exp), t)
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

}
