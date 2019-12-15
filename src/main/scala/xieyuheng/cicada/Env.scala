package xieyuheng.cicada

case class Env(map: Map[String, Val] = Map()) {

  def lookup_val(name: String): Option[Val] = {
    map.get(name)
  }

  def ext(name: String, value: Val): Env = {
    Env(this.map + (name -> value))
  }

  def ext_map(map: Map[String, Val]): Env = {
    Env(this.map ++ map)
  }

}
