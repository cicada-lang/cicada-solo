package xieyuheng.cicada

import java.util.UUID
import collection.immutable.ListMap
import scala.util.{ Try, Success, Failure }

import evaluate._
import equivalent._
import pretty._

object subtype {

  def subtype(s: Value, t: Value): Unit = {
    try {
      (s, t) match {
        case (s: ValuePi, t: ValuePi) =>
          // A1_value = evaluate(s_telescope_env, A1)
          // B1_value = evaluate(t_telescope_env, B1)
          // subtype(B1_value, A1_value) // NOTE contravariant
          // unique_var = unique_var_from(x1, y1)
          // s_telescope_env = s_telescope_env.ext(x1, A1_value, unique_var)
          // t_telescope_env = t_telescope_env.ext(y1, B1_value, unique_var)
          // ...
          // S_value = evaluate(s_telescope_env, S)
          // R_value = evaluate(t_telescope_env, R)
          // subtype(S_value, R_value)
          // ------
          // subtype(
          //   { x1 : A1, x2 : A2, ... -> S } @ s_telescope_env,
          //   { y1 : B1, y2 : B2, ... -> R } @ t_telescope_env)
          if (s.telescope.size != t.telescope.size) {
            throw ErrorReport(List(
              s"subtype fail between ValuePi and ValuePi, size mismatch\n"
            ))
          }
          var s_telescope_env = s.telescope.env
          var t_telescope_env = t.telescope.env
          s.telescope.type_map.zip(t.telescope.type_map).foreach {
            case ((s_name, s), (t_name, t)) =>
              val s_value = evaluate(s_telescope_env, s)
              val t_value = evaluate(t_telescope_env, t)
              subtype(t_value, s_value) // NOTE contravariant
              val unique_var = util.unique_var_from(
                s"subtype:ValuePi:ValuePi:${s_name}:${t_name}")
              s_telescope_env = s_telescope_env.ext(s_name, s_value, unique_var)
              t_telescope_env = t_telescope_env.ext(t_name, t_value, unique_var)
          }
          val s_return_type_value = evaluate(s_telescope_env, s.return_type)
          val t_return_type_value = evaluate(t_telescope_env, t.return_type)
          subtype(s_return_type_value, t_return_type_value)

        case (s: ValueCl, t: ValueCl) =>
          // subtype(s_A1, t_A1)
          // equivalent(s_a1, t_a1)
          // ...
          // t_B1_value = evaluate(t_telescope_env, t_B1)
          // subtype(s_B1, t_B1_value)
          // t_telescope_env = t_telescope_env.ext(y1, s_B1, s_b1)
          // ...
          // s_C1_value = evaluate(s_telescope_env, s_C1)
          // t_C1_value = evaluate(t_telescope_env, t_C1)
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
                  throw ErrorReport(List(
                    s"subtype fail between ValueCl and ValueCl\n" +
                      s"missing name in the subtype class's defined\n" +
                      s"name: ${name}\n"
                  ))
              }
          }
          var t_telescope_env = t.telescope.env
          import collection.mutable.Set
          val name_set: Set[String] = Set()
          t.telescope.type_map.foreach {
            case (name, t_type) =>
              s.defined.get(name) match {
                case Some((s_type_value, s_value)) =>
                  val t_type_value = evaluate(t_telescope_env, t_type)
                  subtype(s_type_value, t_type_value)
                  t_telescope_env = t_telescope_env.ext(name, s_type_value, s_value)
                case None =>
                  name_set.add(name)
              }
          }
          var s_telescope_env = s.telescope.env
          s.telescope.type_map.foreach {
            case (name, s_type) =>
              val s_type_value = evaluate(s_telescope_env, s_type)
              s_telescope_env = s_telescope_env.ext(name, s_type_value, NeutralVar(name))
              if (name_set.contains(name)) {
                val t_type = t.telescope.type_map.get(name).get
                name_set.remove(name)
                val t_type_value = evaluate(t_telescope_env, t_type)
                t_telescope_env = t_telescope_env.ext(name, s_type_value, NeutralVar(name))
                subtype(s_type_value, t_type_value)
              }
          }
          if (!name_set.isEmpty) {
            val s = name_set.mkString(", ")
            throw ErrorReport(List(
              s"subtype fail between ValueCl and ValueCl\n" +
                s"missing names in the subtype class\n" +
                s"names: ${s}\n"
            ))
          }

        case (s, t) =>
          equivalent(s, t)
      }
    } catch {
      case report: ErrorReport =>
        report.throw_prepend(
          s"subtype fail\n" +
            s"s: ${pretty_value(s)}\n" +
            s"t: ${pretty_value(t)}\n")
    }
  }

}
