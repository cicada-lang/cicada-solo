package xieyuheng.cicada_backup

import collection.immutable.ListMap

import eval._
import infer._
import readback._

sealed trait EnvEntry
final case class EnvEntryRecursiveDefine(t: Exp, exp: Exp, env: Env) extends EnvEntry
final case class EnvEntryValue(value: Value) extends EnvEntry

case class Env(entry_map: ListMap[String, EnvEntry] = ListMap()) {

  def lookup_value(name: String): Option[Value] = {
    entry_map.get(name) match {
      case Some(entry) =>
        entry match {
          case EnvEntryRecursiveDefine(t: Exp, exp: Exp, env: Env) =>
            Some(eval(env.ext_recursive(name, t, exp, env), exp))
          case EnvEntryValue(value: Value) =>
            Some(value)
        }
      case None =>
        None
    }
  }

  def ext(name: String, value: Value): Env = {
    Env(this.entry_map + (name -> EnvEntryValue(value)))
  }

  def ext_recursive(name: String, t: Exp, exp: Exp, env: Env): Env = {
    Env(this.entry_map + (name -> EnvEntryRecursiveDefine(t, exp, env)))
  }

  def ext_map(map: Map[String, Value]): Env = {
    val new_entry_map = ListMap(map.map {
      case (name, value) => (name, EnvEntryValue(value))
    }.toList: _*)
    Env(this.entry_map ++ new_entry_map)
  }

  def to_ctx(): Ctx = {
    try {
      var type_map: ListMap[String, Value] = ListMap()
      this.entry_map.toList.zipWithIndex.foreach {
        case ((name, entry), index) =>
          entry match {
            case EnvEntryRecursiveDefine(t: Exp, exp: Exp, env: Env) =>
              val env = Env(this.entry_map.take(index))
              val ctx = Ctx(type_map)
              type_map = type_map + (name -> eval(env, t))
            case EnvEntryValue(value: Value) =>
              val env = Env(this.entry_map.take(index))
              val ctx = Ctx(type_map)
              val t = infer(env, ctx, readback(value))
              type_map = type_map + (name -> t)
          }
      }
      Ctx(type_map)
    } catch {
      case report: Report =>
        report.throw_prepend(
          s"env.to_ctx fail\n"
        )
    }
  }

}
