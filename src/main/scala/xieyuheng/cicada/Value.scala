package xieyuheng.cicada

import collection.immutable.ListMap

case class Telescope(type_map: ListMap[String, Exp], env: Env)

sealed trait Value
final case class ValueType() extends Value
final case class ValuePi(telescope: Telescope, return_type: Exp) extends Value
final case class ValueFn(telescope: Telescope, body: Exp) extends Value
final case class ValueCl(
  defined: ListMap[String, (Value, Value)],
  telescope: Telescope,
) extends Value
final case class ValueClAlready(type_map: ListMap[String, Value]) extends Value
final case class ValueObj(value_map: ListMap[String, Value]) extends Value

sealed trait Neutral extends Value
final case class NeutralVar(name: String) extends Neutral
final case class NeutralAp(target: Neutral, arg_list: List[Value]) extends Neutral
final case class NeutralDot(target: Neutral, field: String) extends Neutral
