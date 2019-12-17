package xieyuheng.cicada

import collection.immutable.ListMap

sealed trait Value
final case class ValueType() extends Value
final case class ValuePi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) extends Value
final case class ValueFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) extends Value
final case class ValueTl(type_map: ListMap[String, Exp], env: Env) extends Value
final case class ValueCl(type_map: ListMap[String, Value]) extends Value
final case class ValueObj(value_map: ListMap[String, Value]) extends Value

sealed trait Neutral extends Value
final case class NeutralVar(name: String) extends Neutral
final case class NeutralAp(target: Neutral, arg_list: List[Value]) extends Neutral
final case class NeutralDot(target: Neutral, field: String) extends Neutral
