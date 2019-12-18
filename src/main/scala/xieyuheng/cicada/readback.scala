package xieyuheng.cicada

import collection.immutable.ListMap

object readback {

  def readback(value: Value): Exp = {
    value match {
      case ValueType() =>
        Type()

      case ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        val (arg_type_value_map, return_type_value) =
          util.force_telescope_with_return(name_list, arg_type_map, return_type, env)
        Pi(readback_list_map(arg_type_value_map), readback(return_type_value))

      case ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) =>
        val name_list = arg_type_map.keys.toList
        val (arg_type_value_map, body_value) =
          util.force_telescope_with_return(name_list, arg_type_map, body, env)
        Fn(readback_list_map(arg_type_value_map), readback(body_value))

      case ValueTl(type_map: ListMap[String, Exp], env: Env) =>
        val name_list = type_map.keys.toList
        Cl(readback_list_map(util.force_telescope(name_list, type_map, env)))

      case ValueCl(type_map: ListMap[String, Value]) =>
        Cl(readback_list_map(type_map))

      case ValueObj(value_map: ListMap[String, Value]) =>
        Obj(readback_list_map(value_map))

      case NeutralVar(name: String) =>
        Var(name)

      case NeutralAp(target: Neutral, arg_list: List[Value]) =>
        Ap(readback(target), arg_list.map(readback))

      case NeutralDot(target: Neutral, field: String) =>
        Dot(readback(target), field)
    }
  }

  def readback_list_map(
    value_map: ListMap[String, Value]
  ): ListMap[String, Exp] = {
    ListMap(value_map.map {
      case (name, value) => (name, readback(value))
    }.toList: _*)
  }

}
