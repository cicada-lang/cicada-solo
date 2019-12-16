package xieyuheng.cicada

import collection.immutable.ListMap

sealed trait Val
final case class ValType() extends Val
final case class ValPi(arg_type_map: ListMap[String, Exp], return_type: Exp, env: Env) extends Val
final case class ValFn(arg_type_map: ListMap[String, Exp], body: Exp, env: Env) extends Val
final case class ValTl(type_map: ListMap[String, Exp], env: Env) extends Val
final case class ValCl(type_map: ListMap[String, Val]) extends Val
final case class ValObj(value_map: ListMap[String, Val]) extends Val

sealed trait Neu extends Val
final case class NeuVar(name: String) extends Neu
final case class NeuAp(target: Neu, arg_list: List[Val]) extends Neu
final case class NeuDot(target: Neu, field: String) extends Neu
