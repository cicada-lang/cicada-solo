import * as Value from "./value"
import * as pretty from "./pretty"
import { equivalent } from "./equivalent"
import { evaluate } from "./evaluate"
import { Report } from "./report"

export function subtype(s: Value.Value, t: Value.Value): void {
  try {
    if (s instanceof Value.Pi && t instanceof Value.Pi) {
      // A1_value = evaluate(s_scope_env, A1)
      // B1_value = evaluate(t_scope_env, B1)
      // subtype(B1_value, A1_value) // NOTE contravariant
      // unique_var = unique_var_from(x1, y1)
      // s_scope_env = s_scope_env.ext(x1, A1_value, unique_var)
      // t_scope_env = t_scope_env.ext(y1, B1_value, unique_var)
      // ...
      // S_value = evaluate(s_scope_env, S)
      // R_value = evaluate(t_scope_env, R)
      // subtype(S_value, R_value)
      // ------
      // subtype(
      //   { x1 : A1, x2 : A2, ... -> S } @ s_scope_env,
      //   { y1 : B1, y2 : B2, ... -> R } @ t_scope_env)

      // NOTE only compare `given` in scope

      if (s.scope.arity != t.scope.arity) {
        throw new Report([
          "subtype fail between Value.Pi and Value.Pi, arity mismatch\n" +
            `left scope arity: ${s.scope.arity}\n` +
            `right scope arity: ${t.scope.arity}\n`])
      }

      let s_scope_env = s.scope_env
      let t_scope_env = t.scope_env

      let s_named_entry_iter = s.scope.named_entries.values()
      let t_named_entry_iter = t.scope.named_entries.values()

      let s_current_type: undefined | Value.Value = undefined
      let t_current_type: undefined | Value.Value = undefined

      function next_type(): void {
        // TODO
      }

      // s.scope.type_map.zip(t.scope.type_map).foreach {
      //   case ((s_name, s), (t_name, t)) =>
      //     val s_value = evaluate(s_scope_env, s)
      //     val t_value = evaluate(t_scope_env, t)
      //     subtype(t_value, s_value) // NOTE contravariant
      //     val unique_var = util.unique_var_from(
      //       s"subtype:ValuePi:ValuePi:${s_name}:${t_name}")
      //     s_scope_env = s_scope_env.ext(s_name, s_value, unique_var)
      //     t_scope_env = t_scope_env.ext(t_name, t_value, unique_var)
      // }

      let s_return_type_value = evaluate(s_scope_env, s.return_type)
      let t_return_type_value = evaluate(t_scope_env, t.return_type)
      subtype(s_return_type_value, t_return_type_value)
    }

    else if (s instanceof Value.Cl && t instanceof Value.Cl) {
      // // subtype(s_A1, t_A1)
      // // equivalent(s_a1, t_a1)
      // // ...
      // // t_B1_value = evaluate(t_scope_env, t_B1)
      // // subtype(s_B1, t_B1_value)
      // // t_scope_env = t_scope_env.ext(y1, s_B1, s_b1)
      // // ...
      // // s_C1_value = evaluate(s_scope_env, s_C1)
      // // t_C1_value = evaluate(t_scope_env, t_C1)
      // // subtype(s_C1_value, t_C1_value)
      // // s_scope_env = s_scope_env.ext(z1, s_C1_value, NeutralVar(z1))
      // // t_scope_env = t_scope_env.ext(z1, s_C1_value, NeutralVar(z1))
      // // ...
      // // ------
      // // subtype(
      // //   { x1 = s_a1 : s_A1, ..., y1 = s_b1 : s_B1, ..., z1 : s_C1, ...} @ s_scope_env,
      // //   { x1 = t_a1 : t_A1, ..., y1        : t_B1, ..., z1 : t_C1, ...} @ t_scope_env)
      // t.defined.foreach {
      //   case (name, (t_type_value, t_value)) =>
      //     s.defined.get(name) match {
      //       case Some((s_type_value, s_value)) =>
      //         subtype(s_type_value, t_type_value)
      //         equivalent(s_value, t_value)
      //       case None =>
      //         throw Report(List(
      //           s"subtype fail between ValueCl and ValueCl\n" +
      //             s"missing name in the subtype class's defined\n" +
      //             s"name: ${name}\n"
      //         ))
      //     }
      // }
      // var t_scope_env = t.scope.env
      // import collection.mutable.Set
      // val name_set: Set[String] = Set()
      // t.scope.type_map.foreach {
      //   case (name, t_type) =>
      //     s.defined.get(name) match {
      //       case Some((s_type_value, s_value)) =>
      //         val t_type_value = evaluate(t_scope_env, t_type)
      //         subtype(s_type_value, t_type_value)
      //         t_scope_env = t_scope_env.ext(name, s_type_value, s_value)
      //       case None =>
      //         name_set.add(name)
      //     }
      // }
      // var s_scope_env = s.scope.env
      // s.scope.type_map.foreach {
      //   case (name, s_type) =>
      //     val s_type_value = evaluate(s_scope_env, s_type)
      //     s_scope_env = s_scope_env.ext(name, s_type_value, NeutralVar(name))
      //     if (name_set.contains(name)) {
      //       val t_type = t.scope.type_map.get(name).get
      //       name_set.remove(name)
      //       val t_type_value = evaluate(t_scope_env, t_type)
      //       t_scope_env = t_scope_env.ext(name, s_type_value, NeutralVar(name))
      //       subtype(s_type_value, t_type_value)
      //     }
      // }
      // if (!name_set.isEmpty) {
      //   val s = name_set.mkString(", ")
      //   throw Report(List(
      //     s"subtype fail between ValueCl and ValueCl\n" +
      //       s"missing names in the subtype class\n" +
      //       s"names: ${s}\n"
      //   ))
      // }
    }

    else {
      equivalent(s, t)
    }
  }

  catch(error) {
    if (error instanceof Report) {
      throw error.prepend(
        "subtype fail\n" +
          `s: ${pretty.pretty_value(s)}\n` +
          `t: ${pretty.pretty_value(t)}\n`)
    }

    else {
      throw error
    }
  }
}
