package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import pretty._
import check._
import infer._
import subtype._
import readback._

object eval {

  def eval(env: Env, exp: Exp): Value = {
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

      case Ap(target: Exp, arg_list: List[Exp]) =>
        eval_apply(env, target, arg_list)

      case Cl(defined, type_map: ListMap[String, Exp]) =>
        ValueCl(
          defined.map { case (name, (t, exp)) => (name, (eval(env, t), eval(env, exp)))},
          Telescope(type_map: ListMap[String, Exp], env: Env))

      case Obj(value_map: ListMap[String, Exp]) =>
        ValueObj(value_map.map {
          case (name, exp) => (name, eval(env, exp))
        })

      case Dot(target: Exp, field: String) =>
        eval_dot(env, target, field)

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_env = env
        block_entry_map.foreach {
          case (name, BlockEntryLet(exp)) =>
            local_env = local_env.ext(name, infer(local_env, exp), eval(local_env, exp))
          case (name, BlockEntryDefine(t, exp)) =>
            local_env = local_env.ext(name, eval(local_env, t), eval(local_env, exp))
        }
        eval(local_env, body)

    }
  }

  def eval_apply(env: Env, target: Exp, arg_list: List[Exp]): Value = {
    val target_value = eval(env, target)
    target_value match {
      case neutral: Neutral =>
        NeutralAp(neutral, arg_list.map { eval(env, _) })

      case ValueFn(telescope: Telescope, body: Exp) =>
        if (telescope.size != arg_list.length) {
          throw Report(List(
            "eval_apply fail, ValueFn arity mismatch\n"
          ))
        }
        var local_env = env
        var telescope_env = telescope.env
        telescope.type_map.zip(arg_list).foreach {
          case ((name, t), arg) =>
            val t_value = eval(telescope_env, t)
            check(env, arg, t_value)
            val arg_value = eval(env, arg) // NOTE use the original `env`
            local_env = local_env.ext(name, t_value, arg_value)
            telescope_env = telescope_env.ext(name, t_value, arg_value)
        }
        eval(local_env, body)

      case ValueFnCase(cases) =>
        cases.find {
          case (telescope, _body) =>
            // NOTE find the first checked case
            Try {
              if (telescope.size != arg_list.length) {
                throw Report(List(
                  "eval_apply fail, ValueFnCase arity mismatch\n"
                ))
              }
              var telescope_env = telescope.env
              telescope.type_map.zip(arg_list).foreach {
                case ((name, t), arg) =>
                  val t_value = eval(telescope_env, t)
                  check(env, arg, t_value) // NOTE use the original `env`
                  val arg_value = eval(env, arg)
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
            telescope.type_map.zip(arg_list).foreach {
              case ((name, t), arg) =>
                val t_value = eval(telescope_env, t)
                check(env, arg, t_value) // NOTE use the original `env`
                val arg_value = eval(env, arg)
                local_env = local_env.ext(name, t_value, arg_value)
                telescope_env = telescope_env.ext(name, t_value, arg_value)
            }
            eval(local_env, body)
          case None =>
            val arg_list_repr = arg_list.map { pretty_exp }.mkString(", ")
            throw Report(List(
              "eval_apply fail, ValueFnCase mismatch\n" +
                s"target_value: ${pretty_value(target_value)}\n" +
                s"arg_list: (${arg_list_repr})\n"
            ))
        }

      case ValueCl(defined, telescope: Telescope) =>
        if (telescope.size < arg_list.length) {
          throw Report(List(
            s"eval_apply fail\n" +
              s"too many arguments\n"
          ))
        }
        var telescope_env = telescope.env
        var new_defined: ListMap[String, (Value, Value)] = ListMap()
        var new_type_map = telescope.type_map
        telescope.type_map.zip(arg_list).foreach {
          case ((name, t), arg) =>
            val t_value = eval(telescope_env, t)
            check(env, arg, t_value)
            val arg_value = eval(env, arg)
            new_defined = new_defined + (name -> (t_value, arg_value))
            telescope_env = telescope_env.ext(name, t_value, arg_value)
            new_type_map = new_type_map.tail
        }
        ValueCl(defined ++ new_defined, Telescope(new_type_map, telescope_env))

      case _ =>
        throw Report(List(
          "eval_apply fail, expecting ValueFn or ValueCl\n" +
            s"target_value: ${pretty_value(target_value)}\n"
        ))
    }
  }

  def eval_dot(env: Env, target: Exp, field: String): Value = {
    val target_value = eval(env, target)
    target_value match {
      case neutral: Neutral =>
        NeutralDot(neutral, field)

      case ValueObj(value_map: ListMap[String, Value]) =>
        value_map.get(field) match {
          case Some(value) => value
          case None =>
            throw Report(List(
              s"missing field: ${field}\n" +
                s"target_value: ${pretty_value(target_value)}\n"
            ))
        }

      case _ =>
        throw Report(List(
          "eval_dot fail, expecting ValueObj\n"
        ))
    }
  }

}
