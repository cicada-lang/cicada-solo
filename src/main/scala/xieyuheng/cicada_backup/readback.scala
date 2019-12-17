package xieyuheng.cicada_backup

import collection.immutable.ListMap

object readback {

  def readback(value: Value): Either[Err, Exp] = {
    value match {
      case ValueType() =>
        Right(Type())

      case ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        for {
          force <- util.force_telescope_with_extra_exp(name_list, arg_type_map, return_type, env)
          (arg_type_map, return_type) = force
          arg_type_map <- readback_list_map(arg_type_map)
          return_type <- readback(return_type)
        } yield Pi(arg_type_map, return_type)

      case ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        for {
          force <- util.force_telescope_with_extra_exp(name_list, arg_type_map, body, env)
          (arg_type_map, body) = force
          arg_type_map <- readback_list_map(arg_type_map)
          body <- readback(body)
        } yield Fn(arg_type_map, body)

      case ValueTl(type_map: ListMap[String, Exp], env: Env) =>
        val name_list = type_map.keys.toList
        for {
          type_map <- util.force_telescope(name_list, type_map, env)
          type_map <- readback_list_map(type_map)
        } yield Cl(type_map)

      case ValueCl(type_map: ListMap[String, Value]) =>
        for {
          type_map <- readback_list_map(type_map)
        } yield Cl(type_map)

      case ValueObj(value_map: ListMap[String, Value]) =>
        for {
          value_map <- readback_list_map(value_map)
        } yield Obj(value_map)

      case NeutralVar(name: String) =>
        Right(Var(name))

      case NeutralAp(target: Neutral, arg_list: List[Value]) =>
        for {
          target <- readback(target)
          arg_list <- readback_list(arg_list)
        } yield Ap(target, arg_list)

      case NeutralDot(target: Neutral, field: String) =>
        for {
          target <- readback(target)
        } yield Dot(target, field)
    }
  }

  def readback_list(
    value_list: List[Value]
  ): Either[Err, List[Exp]] = {
    util.list_map_maybe_err(value_list) {
      case value =>
        readback(value)
    }
  }

  def readback_list_map(
    value_map: ListMap[String, Value]
  ): Either[Err, ListMap[String, Exp]] = {
    util.list_map_map_maybe_err(value_map) {
      case (name, value) =>
        readback(value)
    }
  }

}
