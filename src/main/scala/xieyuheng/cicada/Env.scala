package xieyuheng.cicada

case class Env(map: Map[String, Value] = Map()) {

  def lookup_val(name: String): Option[Value] = {
    map.get(name)
  }

  def ext(name: String, value: Value): Env = {
    Env(this.map + (name -> value))
  }

  def ext_map(map: Map[String, Value]): Env = {
    Env(this.map ++ map)
  }

}
