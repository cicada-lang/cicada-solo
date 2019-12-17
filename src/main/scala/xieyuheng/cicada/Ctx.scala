package xieyuheng.cicada

import collection.immutable.ListMap

sealed trait CtxEntry
final case class CtxEntryTypeValueuePair(t: Value, value: Value) extends CtxEntry

case class Ctx(map: ListMap[String, CtxEntry] = ListMap()) {

  def lookup(name: String): Option[CtxEntry] = {
    map.get(name)
  }

  def lookup_type(name: String): Option[Value] = {
    lookup(name).map {
      case CtxEntryTypeValueuePair(t, _value) => t
    }
  }

  def lookup_value(name: String): Option[Value] = {
    lookup(name).map {
      case CtxEntryTypeValueuePair(_t, value) => value
    }
  }

  def ext(name: String, entry: CtxEntry): Ctx = {
    Ctx(this.map + (name -> entry))
  }

}
