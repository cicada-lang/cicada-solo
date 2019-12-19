package xieyuheng.cicada

import collection.immutable.ListMap

object readback {

  def readback(value: Value): Exp = {
    value match {
      case ValueType() =>
        Type()

      case ValuePi(telescope: Telescope, return_type: Exp) =>
        val name_list = telescope.type_map.keys.toList
        val (type_value_map, return_type_value) =
          util.telescope_force_with_return(telescope, name_list, return_type)
        Pi(readback_list_map(type_value_map), readback(return_type_value))

      case ValueFn(telescope: Telescope, body: Exp) =>
        val name_list = telescope.type_map.keys.toList
        val (type_value_map, body_value) =
          util.telescope_force_with_return(telescope, name_list, body)
        Fn(readback_list_map(type_value_map), readback(body_value))

      case ValueCl(_defined, telescope: Telescope) =>
        val name_list = telescope.type_map.keys.toList
        Cl(readback_list_map(util.telescope_force(telescope, name_list)))

      case ValueClAlready(type_map: ListMap[String, Value]) =>
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
