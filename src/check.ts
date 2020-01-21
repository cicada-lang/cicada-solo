import * as Exp from "./exp"
import * as Value from "./value"
import * as Env from "./env"
import * as Scope from "./scope"
import { Report } from "./report"
import { evaluate } from "./evaluate"
import { infer } from "./infer"
import { subtype } from "./subtype"
import * as pretty from "./pretty"

export function check(
  env: Env.Env,
  exp: Exp.Exp,
  t: Value.Value,
): void {
  try {
    if (exp instanceof Exp.Obj) {
      let { scope } = exp
      check_obj(env, scope, t)
    }

    else if (exp instanceof Exp.Fn) {
      let { scope, body } = exp
      check_fn(env, scope, body, t)
    }

    else if (exp instanceof Exp.FnCase) {
      let { cases } = exp
      for (let fn of cases) {
        let { scope, body } = fn
        check_fn(env, scope, body, t)
      }
    }

    else {
      subtype(infer(env, exp), t)
    }
  }

  catch(error) {
    if (error instanceof Report) {
      throw error.prepend(
        "check fail\n" +
          `exp: ${pretty.pretty_exp(exp)}\n` +
          `value: ${pretty.pretty_value(evaluate(env, exp))}\n` +
          `type: ${pretty.pretty_value(t)}\n`)
    }

    else {
      throw error
    }
  }
}

export function check_obj(
  env: Env.Env,
  scope: Scope.Scope,
  t: Value.Value,
): void {
  if (t instanceof Value.Cl) {
    let { defined, scope } = t
    // // check(local_env, a1, A1)
    // // a1_value = evaluate(local_env, a1)
    // // equivalent(a1_value, d1)
    // // local_env = local_env.ext(x1, A1, a1_value)
    // // ...
    // // ------
    // // check(
    // //   local_env,
    // //   { x1 = a1, x2 = a2, ... },
    // //   { x1 = d1 : A1, x2 = d2 : A2, ... })

    // var local_env = env
    // defined.foreach {
    //   case (name, (t_value, d_value)) =>
    //     value_map.get(name) match {
    //       case Some(v) =>
    //         check(local_env, v, t_value)
    //         val v_value = evaluate(local_env, v)
    //         equivalent(v_value, d_value)
    //         local_env = local_env.ext(name, t_value, v_value)
    //       case None =>
    //         throw Report(List(
    //           s"object does not have the field of defined: ${name}\n"
    //         ))
    //     }
    // }

    // // B1_value = evaluate(scope_env, B1)
    // // check(local_env, b1, A1_value)
    // // b1_value = evaluate(local_env, b1)
    // // local_env = local_env.ext(y1, B1_value, b1_value)
    // // scope_env = scope_env.ext(y1, B1_value, b1_value)
    // // ...
    // // ------
    // // check(
    // //   local_env,
    // //   { y1 = b1, y2 = b2, ... },
    // //   { y1 : B1, y2 : B2, ... } @ scope_env)

    // var scope_env = scope.env
    // scope.type_map.foreach {
    //   case (name, t) =>
    //     value_map.get(name) match {
    //       case Some(v) =>
    //         val t_value = evaluate(scope_env, t)
    //         check(local_env, v, t_value)
    //         val v_value = evaluate(local_env, v)
    //         local_env = local_env.ext(name, t_value, v_value)
    //         scope_env = scope_env.ext(name, t_value, v_value)
    //       case None =>
    //         throw Report(List(
    //           s"object does not have the field of scope: ${name}\n"
    //         ))
    //     }
    // }
  }

  else {
    throw new Report([
      "expecting class type\n" +
        `but found type: ${pretty.pretty_value(t)}\n`])
  }
}

export function check_fn(
  env: Env.Env,
  scope: Scope.Scope,
  body: Exp.Exp,
  t: Value.Value,
): void {
  if (t instanceof Value.Pi) {
    let { scope, return_type } = t
    // // NOTE free variable proof occurs here
    // //   because in `(x1 : A1)`, `x1` is a free variable
    // //   it only have type but does not have value
    // // subtype(evaluate(local_env, A1), evaluate(scope_env, B1))
    // // unique_var = unique_var_from(x1, y1)
    // // local_env = local_env.ext(x1, evaluate(local_env, A1), unique_var)
    // // scope_env = scope_env.ext(y1, evaluate(local_env, A1), unique_var)
    // // ...
    // // check(local_env, r, evaluate(scope_env, R))
    // // ------
    // // check(
    // //   local_env,
    // //   { x1 : A1, x2 : A2, ... => r },
    // //   { y1 : B1, y2 : B2, ... -> R } @ scope_env)

    // if (type_map.size != scope.size) {
    //   throw Report(List(
    //     s"Fn and pi type arity mismatch\n" +
    //       s"arity of fn: ${type_map.size}\n" +
    //       s"arity of pi: ${scope.size}\n"
    //   ))
    // }
    // var local_env = env
    // var scope_env = scope.env
    // scope.type_map.zip(type_map).foreach {
    //   case ((pi_arg_name, pi_arg_type), (fn_arg_name, fn_arg_type)) =>
    //     val pi_arg_type_value = evaluate(scope_env, pi_arg_type)
    //     val fn_arg_type_value = evaluate(local_env, fn_arg_type)
    //     subtype(fn_arg_type_value, pi_arg_type_value)
    //     val unique_var = util.unique_var_from(
    //       s"check:Fn:${pi_arg_name}:${fn_arg_name}")
    //     local_env = local_env.ext(fn_arg_name, fn_arg_type_value, unique_var)
    //     scope_env = scope_env.ext(pi_arg_name, pi_arg_type_value, unique_var)
    // }
  }

  else {
    throw new Report([
      "expecting pi type\n" +
        `but found type: ${pretty.pretty_value(t)}\n`])
  }
}
