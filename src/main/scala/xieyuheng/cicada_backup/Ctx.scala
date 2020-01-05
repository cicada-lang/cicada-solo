package xieyuheng.cicada_backup

import collection.immutable.ListMap

case class Ctx(type_map: ListMap[String, Value] = ListMap()) {

  def lookup_type(name: String): Option[Value] = {
    this.type_map.get(name)
  }

  def ext(name: String, t: Value): Ctx = {
    Ctx(this.type_map + (name -> t))
  }

}
