import * as Exp from "./exp"
import * as Value from "./value"
import * as Env from "./env"
import * as Scope from "./scope"
import { ErrorReport } from "./error"
import { evaluate } from "./evaluate"
import { infer } from "./infer"
import { subtype } from "./subtype"
import { equivalent } from "./equivalent"
import * as pretty from "./pretty"
import * as util from "./util"

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

  catch (error) {
    if (error instanceof ErrorReport) {
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
    let cl = t

    // check(env, a1, A1)
    // a1_value = evaluate(env, a1)
    // equivalent(a1_value, d1)
    // ...
    // ------
    // check(
    //   env,
    //   { x1 = a1, x2 = a2, ... },
    //   { x1 = d1 : A1, x2 = d2 : A2, ... })

    for (let [name, the] of cl.defined) {
      let v = scope.lookup_value(name)
      if (v === undefined) {
        throw new ErrorReport([
          `object does not have the field_name of defined: ${name}\n`
        ])
      }

      check(env, v, the.t)
      let v_value = evaluate(env, v)
      equivalent(v_value, the.value)
    }

    // B1_value = evaluate(scope_env, B1)
    // check(env, b1, A1_value)
    // b1_value = evaluate(env, b1)
    // scope_env = scope_env.ext(y1, B1_value, b1_value)
    // ...
    // ------
    // check(
    //   env,
    //   { y1 = b1, y2 = b2, ... },
    //   { y1 : B1, y2 : B2, ... } @ scope_env)

    let scope_env = cl.scope_env
    for (let [name, entry] of cl.scope.named_entries) {
      let v = scope.lookup_value(name)
      if (v === undefined) {
        throw new ErrorReport([
          `object does not have the field_name of defined: ${name}\n`
        ])
      }

      if (entry instanceof Scope.Entry.Let) {
        let { value: d } = entry
        let t_value = infer(env, v)
        let v_value = evaluate(env, v)
        let d_value = evaluate(scope_env, d)
        equivalent(d_value, v_value)
        scope_env = scope_env.ext(name, { t: t_value, value: v_value })
      }

      else if (entry instanceof Scope.Entry.Given) {
        let { t } = entry
        let t_value = evaluate(scope_env, t)
        check(env, v, t_value)
        let v_value = evaluate(env, v)
        scope_env = scope_env.ext(name, { t: t_value, value: v_value })
      }

      else if (entry instanceof Scope.Entry.Define) {
        let { value: d, t } = entry
        let t_value = evaluate(scope_env, t)
        check(env, v, t_value)
        let v_value = evaluate(env, v)
        let d_value = evaluate(scope_env, d)
        equivalent(d_value, v_value)
        scope_env = scope_env.ext(name, { t: t_value, value: v_value })
      }

      else {
        throw new Error(
          "check_obj fail\n" +
            `unhandled class of Scope.Entry: ${entry.constructor.name}\n`)
      }
    }
  }

  else {
    throw new ErrorReport([
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
    let pi = t

    // NOTE free variable proof occurs here
    //   because in `(x1 : A1)`, `x1` is a free variable
    //   it only have type but does not have value
    // subtype(evaluate(local_env, A1), evaluate(scope_env, B1))
    // unique_var = unique_var_from(x1, y1)
    // local_env = local_env.ext(x1, evaluate(local_env, A1), unique_var)
    // scope_env = scope_env.ext(y1, evaluate(local_env, A1), unique_var)
    // ...
    // check(local_env, r, evaluate(scope_env, R))
    // ------
    // check(
    //   local_env,
    //   { x1 : A1, x2 : A2, ... => r },
    //   { y1 : B1, y2 : B2, ... -> R } @ scope_env)

    if (scope.arity !== pi.scope.arity) {
      throw new ErrorReport([
        "function and pi type arity mismatch\n" +
          `arity of function: ${scope.arity}\n` +
          `arity of pi type: ${pi.scope.arity}\n`])
    }

    let local_env = env
    let scope_env = pi.scope_env
    for (let i = 0; i < scope.arity; i++) {
      let [pi_arg_name, pi_arg_entry] = pi.scope.named_entries[i]
      let [fn_arg_name, fn_arg_entry] = scope.named_entries[i]
      let pi_arg_type_value = Scope.entry_to_type(pi_arg_entry, scope_env)
      let fn_arg_type_value = Scope.entry_to_type(fn_arg_entry, local_env)
      subtype(fn_arg_type_value, pi_arg_type_value)
      let unique_var = util.unique_var_from(
        `check:Fn:${pi_arg_name}:${fn_arg_name}`)
      local_env = local_env.ext(fn_arg_name, { t: fn_arg_type_value, value: unique_var })
      scope_env = scope_env.ext(pi_arg_name, { t: pi_arg_type_value, value: unique_var })
    }
  }

  else {
    throw new ErrorReport([
      "expecting pi type\n" +
        `but found type: ${pretty.pretty_value(t)}\n`])
  }
}
