package xieyuheng.cicada

import collection.immutable.ListMap

sealed trait Exp
final case class Var(name: String) extends Exp
final case class Type() extends Exp
final case class Pi(arg_type_map: ListMap[String, Exp], return_type: Exp) extends Exp
final case class Fn(arg_type_map: ListMap[String, Exp], body: Exp) extends Exp
final case class Ap(target: Exp, arg_list: List[Exp]) extends Exp
final case class Cl(type_map: ListMap[String, Exp]) extends Exp
final case class Obj(value_map: ListMap[String, Exp]) extends Exp
final case class Dot(target: Exp, field: String) extends Exp
final case class Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) extends Exp

sealed trait BlockEntry
final case class BlockLet(value: Exp) extends BlockEntry
final case class BlockDefine(t: Exp, value: Exp) extends BlockEntry
