package xieyuheng.cicada

import collection.immutable.ListMap

sealed trait CtxEntry
final case class CtxEntryTypeValueuePair(t: Value, value: Value) extends CtxEntry

case class Ctx(map: ListMap[String, Value] = ListMap()) {

  def lookup_type(name: String): Option[Value] = {
    map.get(name)
  }

  def ext(name: String, t: Value): Ctx = {
    Ctx(this.map + (name -> t))
  }

  def ext_map(map: ListMap[String, Value]): Ctx = {
    Ctx(this.map ++ map)
  }

  def type_map = map

}
