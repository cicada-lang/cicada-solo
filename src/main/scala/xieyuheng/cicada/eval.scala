package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import pretty._
import check._
import infer._
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

      case Ap(target: Exp, arg_list: List[Exp]) =>
        value_apply(eval(env, target), arg_list.map { eval(env, _) })

      case Cl(defined, type_map: ListMap[String, Exp]) =>
        ValueCl(
          defined.map { case (name, (t, exp)) => (name, (eval(env, t), eval(env, exp)))},
          Telescope(type_map: ListMap[String, Exp], env: Env))

      case Obj(value_map: ListMap[String, Exp]) =>
        ValueObj(value_map.map {
          case (name, exp) => (name, eval(env, exp))
        })

      case Dot(target: Exp, field: String) =>
        value_dot(eval(env, target), field)

      case Union(type_list: List[Exp]) =>
        ValueUnion(type_list.map { eval(env, _) })

      case Switch(name: String, cases: List[(Exp, Exp)]) =>
        env.lookup_value(name) match {
          case Some(value) =>
            // NOTE this is the only place in `eval` to use `check` and `infer`
            //   because we need to check not `Exp : Value` but `Value : Value`
            //   and we have no `ctx` in `eval`
            //   maybe this is not good and we need to fix this
            val ctx = env.to_ctx()
            val result = cases.find {
              case (t, _v) =>
                Try {
                  check(env, ctx, readback(value), eval(env, t))
                } match {
                  case Success(()) => true
                  case Failure(_error) => false
                }
            }
            result match {
              case Some((_t, v)) =>
                eval(env, v)
              case None =>
                throw Report(List(
                  "eval fail, switch mismatch\n"
                ))
            }

          case None =>
            NeutralSwitch(name, cases.map {
              case (t, v) => (eval(env, t), eval(env, v))
            })
        }

      case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
        var local_env = env
        block_entry_map.foreach {
          case (name, BlockEntryLet(exp)) =>
            val value = eval(local_env, exp)
            local_env = local_env.ext(name, value)
          case (name, BlockEntryDefine(_t, exp)) =>
            val value = eval(local_env, exp)
            local_env = local_env.ext(name, value)
        }
        eval(local_env, body)
    }
  }

  def value_apply(value: Value, arg_list: List[Value]): Value = {
    value match {
      case neutral: Neutral =>
        NeutralAp(neutral, arg_list)

      case ValueFn(Telescope(type_map: ListMap[String, Exp], env: Env), body: Exp) =>
        val name_list = type_map.keys.toList
        if (name_list.length != type_map.size) {
          throw Report(List(
            "value_apply fail, ValueFn arity mismatch\n"
          ))
        } else {
          val map = Map(name_list.zip(arg_list): _*)
          eval(env.ext_map(map), body)
        }

      case ValueCl(defined, telescope: Telescope) =>
        val (new_defined, new_telescope) = telescope_apply(telescope, arg_list)
        ValueCl(defined ++ new_defined, new_telescope)

      case _ =>
        throw Report(List(
          "value_apply fail, expecting ValueFn or ValueCl\n" +
            s"value: ${pretty_value(value)}\n"
        ))
    }
  }

  def value_dot(value: Value, field: String): Value = {
    value match {
      case neutral: Neutral =>
        NeutralDot(neutral, field)

      case ValueObj(value_map: ListMap[String, Value]) =>
        value_map.get(field) match {
          case Some(value) => value
          case None =>
            throw Report(List(
              s"missing field: ${field}\n" +
                s"on value: ${pretty_value(value)}\n"
            ))
        }

      case _ =>
        throw Report(List(
          "value_dot fail, expecting ValueObj\n"
        ))
    }
  }

  def telescope_apply(
    telescope: Telescope,
    value_list: List[Value],
  ): (ListMap[String, (Value, Value)], Telescope) = {
    if (telescope.type_map.size < value_list.length) {
      throw Report(List(
        s"telescope_apply fail\n" +
          s"too many arguments\n"
      ))
    }
    var new_defined: ListMap[String, (Value, Value)] = ListMap()
    var new_type_map = telescope.type_map
    var local_env = telescope.env
    telescope.type_map.zip(value_list).foreach {
      case ((name, t_exp), value) =>
        val t = eval(local_env, t_exp)
        new_defined = new_defined + (name -> (t, value))
        local_env = local_env.ext(name, value)
        new_type_map = new_type_map.tail
    }
    (new_defined, Telescope(new_type_map, local_env))
  }

}
