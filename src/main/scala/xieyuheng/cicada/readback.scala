package xieyuheng.cicada

import collection.immutable.ListMap

object readback {

  def readback(value: Val): Either[Err, Exp] = {
    value match {
      case ValType() =>
        Right(Type())

      case ValPi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        for {
          force <- util.force_telescope_with_extra_exp(name_list, arg_type_map, return_type, env)
          (arg_type_map, return_type) = force
          arg_type_map <- readback_list_map(arg_type_map)
          return_type <- readback(return_type)
        } yield Pi(arg_type_map, return_type)

      case ValFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        for {
          force <- util.force_telescope_with_extra_exp(name_list, arg_type_map, body, env)
          (arg_type_map, body) = force
          arg_type_map <- readback_list_map(arg_type_map)
          body <- readback(body)
        } yield Fn(arg_type_map, body)

      case ValTl(type_map: ListMap[String, Exp], env: Env) =>
        val name_list = type_map.keys.toList
        for {
          type_map <- util.force_telescope(name_list, type_map, env)
          type_map <- readback_list_map(type_map)
        } yield Cl(type_map)

      case ValCl(type_map: ListMap[String, Val]) =>
        for {
          type_map <- readback_list_map(type_map)
        } yield Cl(type_map)

      case ValObj(value_map: ListMap[String, Val]) =>
        for {
          value_map <- readback_list_map(value_map)
        } yield Obj(value_map)

      case NeuVar(name: String) =>
        Right(Var(name))

      case NeuAp(target: Neu, arg_list: List[Val]) =>
        for {
          target <- readback(target)
          arg_list <- readback_list(arg_list)
        } yield Ap(target, arg_list)

      case NeuDot(target: Neu, field: String) =>
        for {
          target <- readback(target)
        } yield Dot(target, field)
    }
  }

  def readback_list(
    value_list: List[Val]
  ): Either[Err, List[Exp]] = {
    util.list_map_maybe_err(value_list) {
      case value =>
        readback(value)
    }
  }

  def readback_list_map(
    value_map: ListMap[String, Val]
  ): Either[Err, ListMap[String, Exp]] = {
    util.list_map_map_maybe_err(value_map) {
      case (name, value) =>
        readback(value)
    }
  }

}
