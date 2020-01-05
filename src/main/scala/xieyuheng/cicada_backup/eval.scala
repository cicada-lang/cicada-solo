package xieyuheng.cicada_backup

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

      case FnCase(cases) =>
        ValueFnCase(cases.map {
          case (type_map, body) => (Telescope(type_map, env), body)
        })

      case Ap(target: Exp, arg_list: List[Exp]) =>
        value_apply(env, eval(env, target), arg_list.map { eval(env, _) })

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

      case The(t, value) =>
        eval(env, value) match {
          case value: Neutral =>
            NeutralThe(eval(env, t), value)
          case value =>
            ValueThe(eval(env, t), value)
        }

    }
  }

  def value_apply(env: Env, value: Value, arg_list: List[Value]): Value = {
    value match {
      case neutral: Neutral =>
        NeutralAp(neutral, arg_list)

      case ValueThe(t, value) =>
        value_apply(env, value, arg_list)

      case ValueFn(Telescope(type_map: ListMap[String, Exp], env: Env), body: Exp) =>
        val name_list = type_map.keys.toList
        if (name_list.length != arg_list.length) {
          throw Report(List(
            "value_apply fail, ValueFn arity mismatch\n"
          ))
        }
        val map = Map(name_list.zip(arg_list): _*)
        eval(env.ext_map(map), body)

      case ValueFnCase(cases) =>
        cases.find {
          case (telescope, body) =>
            Try {
              val name_list = telescope.name_list
              if (name_list.length != arg_list.length) {
                throw Report(List(
                  "value_apply fail, ValueFn arity mismatch\n"
                ))
              }
              val value_map = ListMap(name_list.zip(arg_list): _*)
              telescope_check(env.to_ctx(), value_map, telescope)
            } match {
              case Success(()) => true
              case Failure(_error) => false
            }
        } match {
          case Some((telescope, body)) =>
            val name_list = telescope.name_list
            val map = Map(name_list.zip(arg_list): _*)
            eval(telescope.env.ext_map(map), body)
          case None =>
            val arg_list_repr = arg_list.map { pretty_value }.mkString(", ")
            throw Report(List(
              "value_apply fail, ValueFnCase mismatch\n" +
                s"value: ${pretty_value(value)}\n" +
                s"arg_list: (${arg_list_repr})\n"
            ))
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

      case ValueThe(t, value) =>
        value_dot(value, field)

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
