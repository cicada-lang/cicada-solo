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
        case (s: ValuePi, t: ValuePi) =>
          // A1_value = eval(s_telescope_env, A1)
          // B1_value = eval(t_telescope_env, B1)
          // subtype(B1_value, A1_value) // NOTE contravariant
          // unique_var = unique_var_from(x1, y1)
          // s_telescope_env = s_telescope_env.ext(x1, A1_value, unique_var)
          // t_telescope_env = t_telescope_env.ext(y1, B1_value, unique_var)
          // ...
          // S_value = eval(s_telescope_env, S)
          // R_value = eval(t_telescope_env, R)
          // subtype(S_value, R_value)
          // ------
          // subtype(
          //   { x1 : A1, x2 : A2, ... -> S } @ s_telescope_env,
          //   { y1 : B1, y2 : B2, ... -> R } @ t_telescope_env)
          if (s.telescope.size != t.telescope.size) {
            throw Report(List(
              s"subtype fail between ValuePi and ValuePi, size mismatch\n"
            ))
          }
          var s_telescope_env = s.telescope.env
          var t_telescope_env = t.telescope.env
          s.telescope.type_map.zip(t.telescope.type_map).foreach {
            case ((s_name, s), (t_name, t)) =>
              val s_value = eval(s_telescope_env, s)
              val t_value = eval(t_telescope_env, t)
              subtype(t_value, s_value) // NOTE contravariant
              val unique_var = util.unique_var_from(
                s"subtype:ValuePi:ValuePi:${s_name}:${t_name}")
              s_telescope_env = s_telescope_env.ext(s_name, s_value, unique_var)
              t_telescope_env = t_telescope_env.ext(t_name, t_value, unique_var)
          }
          val s_return_type_value = eval(s_telescope_env, s.return_type)
          val t_return_type_value = eval(t_telescope_env, t.return_type)
          subtype(s_return_type_value, t_return_type_value)

        case (s: ValueCl, t: ValueCl) =>
          // subtype(s_A1, t_A1)
          // equivalent(s_a1, t_a1)
          // ...
          // t_B1_value = eval(t_telescope_env, t_B1)
          // subtype(s_B1, t_B1_value)
          // t_telescope_env = t_telescope_env.ext(y1, s_B1, s_b1)
          // ...
          // s_C1_value = eval(s_telescope_env, s_C1)
          // t_C1_value = eval(t_telescope_env, t_C1)
          // subtype(s_C1_value, t_C1_value)
          // s_telescope_env = s_telescope_env.ext(z1, s_C1_value, NeutralVar(z1))
          // t_telescope_env = t_telescope_env.ext(z1, s_C1_value, NeutralVar(z1))
          // ...
          // ------
          // subtype(
          //   { x1 = s_a1 : s_A1, ..., y1 = s_b1 : s_B1, ..., z1 : s_C1, ...} @ s_telescope_env,
          //   { x1 = t_a1 : t_A1, ..., y1        : t_B1, ..., z1 : t_C1, ...} @ t_telescope_env)
          t.defined.foreach {
            case (name, (t_type_value, t_value)) =>
              s.defined.get(name) match {
                case Some((s_type_value, s_value)) =>
                  subtype(s_type_value, t_type_value)
                  equivalent(s_value, t_value)
                case None =>
                  throw Report(List(
                    s"subtype fail between ValueCl and ValueCl\n" +
                      s"missing name in the subtype class\n" +
                      s"name: ${name}\n"
                  ))
              }
          }
          var s_telescope_env = s.telescope.env
          var t_telescope_env = t.telescope.env
          t.telescope.type_map.foreach {
            case (name, t_type) =>
              s.defined.get(name) match {
                case Some((s_type_value, s_value)) =>
                  val t_type_value = eval(t_telescope_env, t_type)
                  subtype(s_type_value, t_type_value)
                  t_telescope_env = t_telescope_env.ext(name, s_type_value, s_value)
                case None =>
                  s.telescope.type_map.get(name) match {
                    case Some(s_type) =>
                      val s_type_value = eval(s_telescope_env, s_type)
                      val t_type_value = eval(t_telescope_env, t_type)
                      subtype(s_type_value, t_type_value)
                      s_telescope_env = s_telescope_env.ext(name, s_type_value, NeutralVar(name))
                      t_telescope_env = t_telescope_env.ext(name, s_type_value, NeutralVar(name))
                    case None =>
                      throw Report(List(
                        s"subtype fail between ValueCl and ValueCl\n" +
                          s"missing name in the subtype class\n" +
                          s"name: ${name}\n"
                      ))
                  }
              }
          }

        case (s: ValueClInferedFromObj, t: ValueClInferedFromObj) =>
          t.type_map.foreach {
            case (name, t_type_value) =>
              s.type_map.get(name) match {
                case Some(s_type_value) =>
                  subtype(s_type_value, t_type_value)
                case None =>
                  throw Report(List(
                    s"subtype fail between ValueClInferedFromObj and ValueClInferedFromObj\n" +
                      s"missing name in the subtype class\n" +
                      s"name: ${name}\n"
                  ))
              }
          }

        case (s: ValueCl, t: ValueClInferedFromObj) =>
          var s_telescope_env = s.telescope.env
          t.type_map.foreach {
            case (name, t_type_value) =>
              s.defined.get(name) match {
                case Some((s_type_value, _s_value)) =>
                  subtype(s_type_value, t_type_value)
                case None =>
                  s.telescope.type_map.get(name) match {
                    case Some(s_type) =>
                      val s_type_value = eval(s_telescope_env, s_type)
                      subtype(s_type_value, t_type_value)
                      s_telescope_env = s_telescope_env.ext(name, s_type_value, NeutralVar(name))
                    case None =>
                      throw Report(List(
                        s"subtype fail between ValueCl and ValueClInferedFromObj\n" +
                          s"missing name in the subtype class\n" +
                          s"name: ${name}\n"
                      ))
                  }
              }
          }

        case (s: ValueClInferedFromObj, t: ValueCl) =>
          if (t.defined.size != 0) {
            throw Report(List(
              s"subtype fail between ValueClInferedFromObj and ValueCl\n" +
                s"ValueCl's defined must be empty\n" +
                s"because this must be a free variable proof\n"
            ))
          }
          var t_telescope_env = t.telescope.env
          t.telescope.type_map.foreach {
            case (name, t_type) =>
              s.type_map.get(name) match {
                case Some(s_type_value) =>
                  val t_type_value = eval(t_telescope_env, t_type)
                  subtype(s_type_value, t_type_value)
                  t_telescope_env = t_telescope_env.ext(name, s_type_value, NeutralVar(name))
                case None =>
                  throw Report(List(
                    s"subtype fail between ValueCl and ValueClInferedFromObj\n" +
                      s"missing name in the subtype class\n" +
                      s"name: ${name}\n"
                  ))
              }
          }

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

}
