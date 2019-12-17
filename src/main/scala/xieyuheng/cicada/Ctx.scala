package xieyuheng.cicada

import collection.immutable.ListMap

case class Ctx(map: ListMap[String, Val] = ListMap()) {

  def lookup_type(name: String): Option[Val] = {
    map.get(name)
  }

  def ext(name: String, t: Val): Ctx = {
    Ctx(this.map + (name -> t))
  }

  def ext_map(map: ListMap[String, Val]): Ctx = {
    Ctx(this.map ++ map)
  }

  def type_map = map

}
