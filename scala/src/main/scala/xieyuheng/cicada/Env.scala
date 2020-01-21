package xieyuheng.cicada

import collection.immutable.ListMap

import evaluate._

sealed trait EnvEntry
final case class EnvEntryDefineRec(t: Exp, value: Exp, env: Env) extends EnvEntry
final case class EnvEntryDefine(t: Value, value: Value) extends EnvEntry

case class Env(entry_map: ListMap[String, EnvEntry] = ListMap()) {

  def lookup_type_and_value(name: String): Option[(Value, Value)] = {
    entry_map.get(name).map {
      case EnvEntryDefineRec(t: Exp, value: Exp, env: Env) =>
        (evaluate(env.ext_rec(name, t, value, env), t),
          evaluate(env.ext_rec(name, t, value, env), value))
      case EnvEntryDefine(t: Value, value: Value) =>
        (t, value)
    }
  }

  def lookup_type(name: String): Option[Value] = {
    lookup_type_and_value(name).map {
      case (t, _value) => t
    }
  }

  def lookup_value(name: String): Option[Value] = {
    lookup_type_and_value(name).map {
      case (_t, value) => value
    }
  }

  def ext(name: String, t: Value, value: Value): Env = {
    Env(this.entry_map + (name -> EnvEntryDefine(t, value)))
  }

  def ext_rec(name: String, t: Exp, value: Exp, env: Env): Env = {
    Env(this.entry_map + (name -> EnvEntryDefineRec(t, value, env)))
  }

}
