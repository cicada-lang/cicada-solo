package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import pretty._
import check._
import infer._
import readback._

object evaluate {

  def evaluate(env: Env, exp: Exp): Value = {
    exp match {
      case Var(name: String) =>
        env.lookup_value(name) match {
          case Some(value) =>
            value
          case None =>
            NeutralVar(name)
        }

      case Type() =>
        ValueType()

      case StrType() =>
        ValueStrType()

      case Str(str: String) =>
        ValueStr(str)

      case Pi(type_map: ListMap[String, Exp], return_type: Exp) =>
        ValuePi(Telescope(type_map: ListMap[String, Exp], env: Env), return_type: Exp)

      case Fn(type_map: ListMap[String, Exp], body: Exp) =>
        ValueFn(Telescope(type_map: ListMap[String, Exp], env: Env), body: Exp)

      case FnCase(cases) =>
        ValueFnCase(cases.map {
          case (type_map, body) => (Telescope(type_map, env), body)
        })

      case Ap(target: Exp, args: List[Exp]) =>
        evaluate_ap(env, target, args)

      case Cl(defined, type_map: ListMap[String, Exp]) =>
        ValueCl(
          defined.map { case (name, (t, exp)) => (name, (evaluate(env, t), evaluate(env, exp)))},
          Telescope(type_map: ListMap[String, Exp], env: Env))

      case Obj(value_map: ListMap[String, Exp]) =>
        ValueObj(value_map.map {
          case (name, exp) => (name, evaluate(env, exp))
        })

      case Dot(target: Exp, field_name: String) =>
        evaluate_dot(env, target, field_name)

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_env = env
        block_entry_map.foreach {
          case (name, BlockEntryLet(exp)) =>
            local_env = local_env.ext(name, infer(local_env, exp), evaluate(local_env, exp))
          case (name, BlockEntryDefine(t, exp)) =>
            local_env = local_env.ext(name, evaluate(local_env, t), evaluate(local_env, exp))
        }
        evaluate(local_env, body)

    }
  }

  def evaluate_ap(env: Env, target: Exp, args: List[Exp]): Value = {
    val target_value = evaluate(env, target)
    target_value match {
      case neutral: Neutral =>
        NeutralAp(neutral, args.map { evaluate(env, _) })

      case ValueFn(telescope: Telescope, body: Exp) =>
        if (telescope.size != args.length) {
          throw ErrorReport(List(
            "evaluate_ap fail, ValueFn arity mismatch\n"
          ))
        }
        var local_env = env
        var telescope_env = telescope.env
        telescope.type_map.zip(args).foreach {
          case ((name, t), arg) =>
            val t_value = evaluate(telescope_env, t)
            check(env, arg, t_value)
            val arg_value = evaluate(env, arg) // NOTE use the original `env`
            local_env = local_env.ext(name, t_value, arg_value)
            telescope_env = telescope_env.ext(name, t_value, arg_value)
        }
        evaluate(local_env, body)

      case ValueFnCase(cases) =>
        cases.find {
          case (telescope, _body) =>
            // NOTE find the first checked case
            Try {
              if (telescope.size != args.length) {
                throw ErrorReport(List(
                  "evaluate_ap fail, ValueFnCase arity mismatch\n"
                ))
              }
              var telescope_env = telescope.env
              telescope.type_map.zip(args).foreach {
                case ((name, t), arg) =>
                  val t_value = evaluate(telescope_env, t)
                  val arg_value = evaluate(env, arg)
                  val arg_norm = readback(arg_value)
                  check(env, arg_norm, t_value) // NOTE use the original `env`
                  telescope_env = telescope_env.ext(name, t_value, arg_value)
              }
            } match {
              case Success(_ok) => true
              case Failure(_error) => false
            }
        } match {
          case Some((telescope, body)) =>
            var local_env = env
            var telescope_env = telescope.env
            telescope.type_map.zip(args).foreach {
              case ((name, t), arg) =>
                val t_value = evaluate(telescope_env, t)
                val arg_value = evaluate(env, arg)
                local_env = local_env.ext(name, t_value, arg_value)
                telescope_env = telescope_env.ext(name, t_value, arg_value)
            }
            evaluate(local_env, body)
          case None =>
            val args_repr = args.map { pretty_exp }.mkString(", ")
            throw ErrorReport(List(
              "evaluate_ap fail, ValueFnCase mismatch\n" +
                s"target_value: ${pretty_value(target_value)}\n" +
                s"args: (${args_repr})\n"
            ))
        }

      case ValueCl(defined, telescope: Telescope) =>
        if (telescope.size < args.length) {
          throw ErrorReport(List(
            s"evaluate_ap fail\n" +
              s"too many arguments\n"
          ))
        }
        var telescope_env = telescope.env
        var new_defined: ListMap[String, (Value, Value)] = ListMap()
        var new_type_map = telescope.type_map
        telescope.type_map.zip(args).foreach {
          case ((name, t), arg) =>
            val t_value = evaluate(telescope_env, t)
            check(env, arg, t_value)
            val arg_value = evaluate(env, arg)
            new_defined = new_defined + (name -> (t_value, arg_value))
            telescope_env = telescope_env.ext(name, t_value, arg_value)
            new_type_map = new_type_map.tail
        }
        ValueCl(defined ++ new_defined, Telescope(new_type_map, telescope_env))

      case _ =>
        throw ErrorReport(List(
          "evaluate_ap fail, expecting ValueFn or ValueCl\n" +
            s"target_value: ${pretty_value(target_value)}\n"
        ))
    }
  }

  def evaluate_dot(env: Env, target: Exp, field_name: String): Value = {
    val target_value = evaluate(env, target)
    target_value match {
      case neutral: Neutral =>
        NeutralDot(neutral, field_name)

      case ValueObj(value_map: ListMap[String, Value]) =>
        value_map.get(field_name) match {
          case Some(value) => value
          case None =>
            throw ErrorReport(List(
              s"missing field_name: ${field_name}\n" +
                s"target_value: ${pretty_value(target_value)}\n"
            ))
        }

      case _ =>
        throw ErrorReport(List(
          "evaluate_dot fail, expecting ValueObj\n"
        ))
    }
  }

}
