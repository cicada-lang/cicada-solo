package xieyuheng.cicada

import collection.immutable.ListMap

sealed trait Exp
final case class Var(name: String) extends Exp
final case class Type() extends Exp
final case class StrType() extends Exp
final case class Str(str: String) extends Exp
final case class Pi(type_map: ListMap[String, Exp], return_type: Exp) extends Exp
final case class Fn(type_map: ListMap[String, Exp], body: Exp) extends Exp
final case class FnCase(cases: List[(ListMap[String, Exp], Exp)]) extends Exp
final case class Ap(target: Exp, args: List[Exp]) extends Exp
final case class Cl(defined: ListMap[String, (Exp, Exp)], type_map: ListMap[String, Exp]) extends Exp
final case class Obj(value_map: ListMap[String, Exp]) extends Exp
final case class Dot(target: Exp, field_name: String) extends Exp
final case class Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) extends Exp

sealed trait BlockEntry
final case class BlockEntryLet(value: Exp) extends BlockEntry
final case class BlockEntryDefine(t: Exp, value: Exp) extends BlockEntry
