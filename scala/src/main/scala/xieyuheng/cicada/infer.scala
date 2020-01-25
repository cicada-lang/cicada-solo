package xieyuheng.cicada

import collection.immutable.ListMap
import scala.util.{ Try, Success, Failure }

import pretty._
import evaluate._
import check._
import readback._

object infer {

  def infer(env: Env, exp: Exp): Value = {
    try {
      exp match {
        case Var(name: String) =>
          env.lookup_type(name) match {
            case Some(t) => t
            case None =>
              throw ErrorReport(List(
                s"can not find var: ${name} in env\n"
              ))
          }

        case Type() =>
          ValueType()

        case StrType() =>
          ValueType()

        case Str(str: String) =>
          ValueStrType()

        case Pi(type_map: ListMap[String, Exp], return_type: Exp) =>
          // check(local_env, A1, type)
          // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
          // ...
          // check(local_env, R, type)
          // ------
          // infer(local_env, { x1 : A1, x2 : A2, ... -> R }) = type
          var local_env = env
          type_map.foreach {
            case (name, t) =>
              check(local_env, t, ValueType())
              local_env = local_env.ext(name, evaluate(local_env, t), NeutralVar(name))
          }
          check(local_env, return_type, ValueType())
          ValueType()

        case Fn(type_map: ListMap[String, Exp], body: Exp) =>
          // local_env = env
          // check(local_env, A1, type)
          // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
          // ...
          // R_value = infer(local_env, r)
          // R = readback(R_value)
          // ------
          // infer(
          //   env,
          //   { x1 : A1, x2 : A2, ... => r }) = { x1 : A1, x2 : A2, ... => R } @ env
          var local_env = env
          type_map.foreach {
            case (name, t) =>
              check(local_env, t, ValueType())
              local_env = local_env.ext(name, evaluate(local_env, t), NeutralVar(name))
          }
          val return_type_value = infer(local_env, body)
          val return_type = readback(return_type_value)
          ValuePi(Telescope(type_map, env), return_type)

        case FnCase(cases) =>
          throw ErrorReport(List(
            s"the language is not designed to infer the type of FnCase: ${exp}\n"
          ))

        case Cl(defined, type_map: ListMap[String, Exp]) =>
          // check(local_env, A1, type)
          // A1_value = evaluate(local_env, A1)
          // check(local_env, d1, A1_value)
          // d1_value = evaluate(local_env, d1)
          // local_env = local_env.ext(x1, A1_value, d1_value)
          // ...
          // check(local_env, B1, type)
          // B1_value = evaluate(local_env, B1)
          // local_env = local_env.ext(y1, B1_value, NeutralVar(y1))
          // ...
          // ------
          // infer(
          //   local_env,
          //   { x1 = d1 : A1, x2 = d2 : A2, ..., y1 : B1, y2 : B2, ... }) = type
          var local_env = env
          defined.foreach {
            case (name, (t, d)) =>
              check(local_env, t, ValueType())
              val t_value = evaluate(local_env, t)
              check(local_env, d, t_value)
              val d_value = evaluate(local_env, d)
              local_env = local_env.ext(name, t_value, d_value)
          }
          type_map.foreach {
            case (name, t) =>
              check(local_env, t, ValueType())
              val t_value = evaluate(local_env, t)
              local_env = local_env.ext(name, t_value, NeutralVar(name))
          }
          ValueType()

        case Obj(value_map: ListMap[String, Exp]) =>
          // A1 = infer(local_env, a1)
          // a1_value = evaluate(local_env, a1)
          // local_env = local_env.ext(x1, a1_value, A1)
          // ...
          // ------
          // infer(local_env, { x1 = a1, x2 = a2, ... }) =
          //   { x1 = a1_value : A1, x2 = a2_value : A2, ... } @ local_env
          var local_env = env
          var defined: ListMap[String, (Value, Value)] = ListMap()
          value_map.foreach {
            case (name, v) =>
              val t_value = infer(local_env, v)
              val v_value = evaluate(local_env, v)
              local_env = local_env.ext(name, t_value, v_value)
              defined = defined + (name -> (t_value, v_value))
          }
          ValueCl(defined, Telescope(ListMap(), local_env))

        case Ap(target: Exp, args: List[Exp]) =>
          infer(env, target) match {
            // { x1 : A1, x2 : A2, ... -> R } @ telescope_env = infer(env, f)
            // A1_value = evaluate(telescope_env, A1)
            // check(env, a1, A1_value)
            // telescope_env = telescope_env.ext(x1, A1_value, evaluate(env, a1))
            // ...
            // ------
            // infer(env, f(a1, a2, ...)) = evaluate(telescope_env, R)
            case ValuePi(telescope: Telescope, return_type: Exp) =>
              if (args.length != telescope.size) {
                throw ErrorReport(List(
                  s"args and pi type arity mismatch\n" +
                    s"arity of args: ${args.length}\n" +
                    s"arity of pi: ${telescope.size}\n"
                ))
              }
              var telescope_env = telescope.env
              telescope.type_map.zip(args).foreach {
                case ((name, t), arg) =>
                  val t_value = evaluate(telescope_env, t)
                  check(env, arg, t_value)
                  telescope_env = telescope_env.ext(name, t_value, evaluate(env, arg))
              }
              evaluate(telescope_env, return_type)

            case ValueType() =>
              evaluate(env, target) match {
                case ValueCl(defined, telescope) =>
                  if (args.length > telescope.size) {
                    throw ErrorReport(List(
                      s"too many arguments to apply class\n" +
                        s"length of args: ${args.length}\n" +
                        s"arity of cl: ${telescope.size}\n"
                    ))
                  }
                  var telescope_env = telescope.env
                  telescope.type_map.zip(args).foreach {
                    case ((name, t), arg) =>
                      val t_value = evaluate(telescope_env, t)
                      check(env, arg, t_value)
                      telescope_env = telescope_env.ext(name, evaluate(env, arg), t_value)
                  }
                  ValueType()

                case t =>
                  throw ErrorReport(List(
                    s"expecting ValueCl but found: ${t}\n"
                  ))
              }

            case t =>
              throw ErrorReport(List(
                s"expecting ValuePi type but found: ${t}\n"
              ))
          }

        case Dot(target: Exp, field_name: String) =>
          val t_infered = infer(env, target)
          t_infered match {
            case ValueCl(defined, telescope) =>
              // CASE found `m` in `defined`
              // { ..., m = d : T, ... } @ telescope_env = infer(env, e)
              // ------
              // infer(env, e.m) = T
              // CASE found `m` in `telescope`
              // { x1 : A1,
              //   x2 : A2, ...
              //   m : T, ... } @ telescope_env = infer(env, e)
              // telescope_env = telescope_env.ext(x1, evaluate(telescope_env, T), NeutralVar(x1))
              // ...
              // T_value = evaluate(telescope_env, T)
              // ------
              // infer(env, e.m) = T_value
              defined.get(field_name) match {
                case Some((t, _v)) => t
                case None =>
                  var result: Option[Value] = None
                  var telescope_env = telescope.env
                  telescope.type_map.foreach {
                    case (name, t) =>
                      if (name == field_name) {
                        result = Some(evaluate(telescope_env, t))
                      }
                      telescope_env = telescope_env.ext(name, evaluate(telescope_env, t), NeutralVar(name))
                  }
                  result match {
                    case Some(t) => t
                    case None =>
                      throw ErrorReport(List(
                        s"infer fail\n" +
                          s"on ValueCl\n" +
                          s"target exp: ${pretty_exp(target)}\n" +
                          s"infered target type: ${pretty_value(t_infered)}\n" +
                          s"can not find field_name for dot: ${field_name}\n"
                      ))
                  }
              }

            case t =>
              throw ErrorReport(List(
                s"expecting class\n" +
                  s"found type: ${pretty_value(t)}\n" +
                  s"target: ${pretty_exp(target)}\n"
              ))
          }

        case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
          var local_env = env
          block_entry_map.foreach {
            case (name, BlockEntryLet(exp)) =>
              local_env = local_env.ext(name, infer(local_env, exp), evaluate(local_env, exp))
            case (name, BlockEntryDefine(t, exp)) =>
              local_env = local_env.ext(name, evaluate(local_env, t), evaluate(local_env, exp))
          }
          infer(local_env, body)

      }
    } catch {
      case report: ErrorReport =>
        report.throw_prepend(
          s"infer fail\n" +
            s"exp: ${pretty_exp(exp)}\n"
        )
    }

  }

}
