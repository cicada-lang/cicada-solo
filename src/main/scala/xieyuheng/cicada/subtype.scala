package xieyuheng.cicada

import java.util.UUID
import collection.immutable.ListMap
import scala.util.{ Try, Success, Failure }

import eval._
import equivalent._
import pretty._

object subtype {

  def subtype(s: Value, t: Value): Unit = {
    try {
      (s, t) match {
        case (s: ValueUnion, t) =>
          s.type_list.foreach { subtype(_, t) }

        case (s, t: ValueUnion) =>
          val exists_p = t.type_list.exists {
            case t =>
              Try {
                subtype(s, t)
              } match {
                case Success(()) => true
                case Failure(_error) => false
              }
          }
          if (!exists_p) {
            throw Report(List(
              s"subtype fail on ValueUnion\n"
            ))
          }

        case (s: ValuePi, t: ValuePi) =>
          if (s.telescope.type_map.size != t.telescope.type_map.size) {
            throw Report(List(
              s"subtype fail on ValuePi, arity mismatch\n"
            ))
          } else {
            val name_list = s.telescope.type_map.keys.zip(t.telescope.type_map.keys).map {
              case (s_name, t_name) =>
                val uuid: UUID = UUID.randomUUID()
                s"#subtype-pi-type:${s_name}:${t_name}:${uuid}"
            }.toList
            val (s_type_map, s_return_type) =
              util.telescope_force_with_return(s.telescope, name_list, s.return_type)
            val (t_type_map, t_return_type) =
              util.telescope_force_with_return(t.telescope, name_list, t.return_type)
            subtype_list_map(t_type_map, s_type_map)
            subtype(s_return_type, t_return_type)
          }

        case (s: ValueCl, t: ValueCl) =>
          subtype_class(
            s.defined, s.telescope.type_map, s.telescope.env,
            t.defined, t.telescope.type_map, t.telescope.env)

        case (s: ValueClInferedFromObj, t: ValueClInferedFromObj) =>
          subtype_list_map(s.type_map, t.type_map)

        case (s: ValueCl, t: ValueClInferedFromObj) =>
          subtype_defined_list_map(
            s.defined, util.telescope_force(s.telescope, s.telescope.name_list),
            ListMap(), t.type_map)

        case (s: ValueClInferedFromObj, t: ValueCl) =>
          if (t.defined.size != 0) {
            throw Report(List(
              s"a free variable proof is required for ValueClInferedFromObj <: ValueCl\n"
            ))
          }
          subtype_list_map(
            s.type_map,
            util.telescope_force(t.telescope, t.telescope.name_list))

        case (s: ValueThe, t: ValueThe) =>
          if (s.t != ValueType()) {
            throw Report(List(
              s"type of the s is not type: ${pretty_value(s.t)}\n"
            ))
          }
          if (t.t != ValueType()) {
            throw Report(List(
              s"type of the t is not type: ${pretty_value(t.t)}\n"
            ))
          }
          subtype(s.value, t.value)

        case (s, t) =>
          equivalent(s, t)
      }
    } catch {
      case report: Report =>
        report.throw_prepend(
          s"subtype fail\n" +
            s"s: ${pretty_value(s)}\n" +
            s"t: ${pretty_value(t)}\n")
    }
  }

  def subtype_list_map(
    s_map: ListMap[String, Value],
    t_map: ListMap[String, Value],
  ): Unit = {
    t_map.foreach {
      case (name, t) =>
        s_map.get(name) match {
          case Some(s) =>
            subtype(s, t)
          case None =>
            throw Report(List(
              s"subtype_list_map can not find field: ${name}\n"
            ))
        }
    }
  }

  def subtype_defined_list_map(
    s_defined: ListMap[String, (Value, Value)], s_map: ListMap[String, Value],
    t_defined: ListMap[String, (Value, Value)], t_map: ListMap[String, Value],
  ): Unit = {
    t_defined.foreach {
      case (name, (t, v)) =>
        s_defined.get(name) match {
          case Some((s, u)) =>
            subtype(s, t)
            equivalent(u, v)
          case None =>
            throw Report(List(
              s"subtype_defined can not find field: ${name}\n"
            ))
        }
    }
    t_map.foreach {
      case (name, t) =>
        s_map.get(name) match {
          case Some(s) =>
            subtype(s, t)
          case None =>
            s_defined.get(name) match {
              case Some((s, _u)) =>
                subtype(s, t)
              case None =>
                throw Report(List(
                  s"subtype_defined_list_map can not find field: ${name}\n"
                ))
            }
        }
    }
  }

  def subtype_class(
    s_defined: ListMap[String, (Value, Value)], s_map: ListMap[String, Exp], s_env: Env,
    t_defined: ListMap[String, (Value, Value)], t_map: ListMap[String, Exp], t_env: Env,
  ): Unit = {
    var local_env = t_env
    t_defined.foreach {
      case (name, (t, v)) =>
        s_defined.get(name) match {
          case Some((s, u)) =>
            subtype(s, t)
            equivalent(u, v)
          case None =>
          case _ =>
            throw Report(List(
              s"subtype_class can not find field in defined: ${name}\n"
            ))
        }
    }
    t_map.foreach {
      case (name, t) =>
        s_map.get(name) match {
          case Some(s) =>
            subtype(eval(s_env, s), eval(local_env, t))
          case None =>
            s_defined.get(name) match {
              case Some((s, u)) =>
                local_env = local_env.ext(name, u)
                subtype(s, eval(local_env, t))
              case None =>
                throw Report(List(
                  s"subtype_class can not find field in telescope: ${name}\n"
                ))
            }
        }
    }
  }

}
