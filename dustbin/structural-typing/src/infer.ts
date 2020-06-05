import * as Exp from "./exp"
import * as Value from "./value"
import * as Neutral from "./neutral"
import * as Env from "./env"
import * as Scope from "./scope"
import * as Err from "./err"
import { evaluate, eliminate_ap } from "./evaluate"
import { check } from "./check"
import { readback } from "./readback"
import * as pretty from "./pretty"

export function infer(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    if (exp instanceof Exp.Var) {
      let { name } = exp
      let t = env.lookup_type(name)
      if (t === undefined) {
        // throw new Err.Report([
        //   `can not find var: ${name} in env:\n` +
        //   `<env>${pretty.pretty_env(env, "\n")}</env>\n`])
        throw new Err.Report([`can not find var: ${name} in env:\n`])
      } else {
        return t
      }
    } else if (exp instanceof Exp.Type) {
      return new Value.Type()
    } else if (exp instanceof Exp.StrType) {
      return new Value.Type()
    } else if (exp instanceof Exp.Str) {
      return new Value.StrType()
    } else if (exp instanceof Exp.Pi) {
      let { scope, return_type } = exp

      // check(local_env, A1, type)
      // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
      // ...
      // check(local_env, R, type)
      // ------
      // infer(local_env, { x1 : A1, x2 : A2, ... -> R }) = type

      let local_env = Scope.scope_check(scope, env)
      check(local_env, return_type, new Value.Type())
      return new Value.Type()
    } else if (exp instanceof Exp.Fn) {
      let { scope, body } = exp

      // local_env = env
      // check(local_env, A1, type)
      // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
      // ...
      // R_value = infer(local_env, r)
      // R = readback(R_value)
      // ------
      // infer(
      //   env,
      //   { x1 : A1, x2 : A2, ... => r }) = { x1 : A1, x2 : A2, ... => R } @ env

      let local_env = Scope.scope_check(scope, env)
      let return_type_value = infer(local_env, body)
      let return_type = readback(return_type_value)
      return new Value.Pi(scope, return_type, env) // NOTE use `env` instead of `local_env`
    } else if (exp instanceof Exp.FnCase) {
      throw new Err.Report([
        `the language is not designed to infer the type of Exp.FnCase: ${pretty.pretty_exp(
          exp
        )}\n`,
      ])
    } else if (exp instanceof Exp.Cl) {
      let { scope } = exp

      // check(local_env, A1, type)
      // A1_value = evaluate(local_env, A1)
      // check(local_env, d1, A1_value)
      // d1_value = evaluate(local_env, d1)
      // local_env = local_env.ext(x1, A1_value, d1_value)
      // ...
      // check(local_env, B1, type)
      // B1_value = evaluate(local_env, B1)
      // local_env = local_env.ext(y1, B1_value, NeutralVar(y1))
      // ...
      // ------
      // infer(
      //   local_env,
      //   { x1 = d1 : A1, x2 = d2 : A2, ..., y1 : B1, y2 : B2, ... }) = type

      Scope.scope_check(scope, env)
      return new Value.Type()
    } else if (exp instanceof Exp.Obj) {
      let { scope } = exp

      // A1 = infer(local_env, a1)
      // a1_value = evaluate(local_env, a1)
      // local_env = local_env.ext(x1, a1_value, A1)
      // ...
      // ------
      // infer(local_env, { x1 = a1, x2 = a2, ... }) =
      //   { x1 = a1_value : A1, x2 = a2_value : A2, ... } @ local_env

      let defined = new Map()
      let local_env = Scope.scope_check(scope, env, (name, the) => {
        defined.set(name, the)
      })
      return new Value.Cl(defined, new Scope.Scope([]), local_env)
    } else if (exp instanceof Exp.Ap) {
      let { target, args } = exp
      return infer_ap(env, target, args)
    } else if (exp instanceof Exp.Dot) {
      let { target, field_name } = exp
      return infer_dot(env, target, field_name)
    } else if (exp instanceof Exp.Equation) {
      let { t, lhs, rhs } = exp
      let t_value = evaluate(env, t)
      check(env, lhs, t_value)
      check(env, rhs, t_value)
      return new Value.Type()
    } else if (exp instanceof Exp.Same) {
      let { t, value } = exp
      return new Value.Equation(evaluate(env, t), value, value, env)
    } else if (exp instanceof Exp.Transport) {
      let { equation, motive, base } = exp
      let equation_type = infer(env, equation)
      if (equation_type instanceof Value.Equation) {
        let { lhs, rhs, equation_env } = equation_type
        let motive_type = infer(env, motive)
        if (motive_type instanceof Value.Pi) {
          let pi = motive_type
          Scope.scope_check_with_args(
            pi.scope,
            pi.scope_env,
            [lhs],
            equation_env
          )
          Scope.scope_check_with_args(
            pi.scope,
            pi.scope_env,
            [rhs],
            equation_env
          )
          let motive_value = evaluate(env, motive)
          check(env, base, eliminate_ap(equation_env, motive_value, [lhs]))
          return eliminate_ap(equation_env, motive_value, [rhs])
        } else {
          throw new Err.Report([
            "infer_transport fail\n" +
              "motive_type type is not Value.Pi\n" +
              `target: ${pretty.pretty_value(motive_type)}\n`,
          ])
        }
      } else {
        throw new Err.Report([
          "infer_transport fail\n" +
            "expecting equation_type to be Value.Equation\n" +
            `found: ${pretty.pretty_value(equation_type)}\n`,
        ])
      }
    } else if (exp instanceof Exp.Block) {
      let { scope, body } = exp
      let local_env = Scope.scope_check(scope, env)
      return infer(local_env, body)
    } else if (exp instanceof Exp.The) {
      let { t, value } = exp
      let t_value = evaluate(env, t)
      // check(env, value, t_value) // TODO why fail
      return t_value
    } else {
      throw new Err.Unhandled(exp)
    }
  } catch (error) {
    if (error instanceof Err.Report) {
      throw error.prepend("infer fail\n" + `exp: ${pretty.pretty_exp(exp)}\n`)
    } else {
      throw error
    }
  }
}

export function infer_ap(
  env: Env.Env,
  target: Exp.Exp,
  args: Array<Exp.Exp>
): Value.Value {
  let t_infered = infer(env, target)

  if (t_infered instanceof Value.Pi) {
    // { x1 : A1, x2 : A2, ... -> R } @ scope_env = infer(env, f)
    // A1_value = evaluate(scope_env, A1)
    // check(env, a1, A1_value)
    // scope_env = scope_env.ext(x1, A1_value, evaluate(env, a1))
    // ...
    // ------
    // infer(env, f(a1, a2, ...)) = evaluate(scope_env, R)

    let { scope, return_type, scope_env } = t_infered

    if (args.length !== scope.arity) {
      throw new Err.Report([
        "args and pi type arity mismatch\n" +
          `arity of args: ${args.length}\n` +
          `arity of pi: ${scope.arity}\n`,
      ])
    }

    try {
      scope_env = Scope.scope_check_with_args(scope, scope_env, args, env)
      return evaluate(scope_env, return_type)
    } catch (error) {
      if (error instanceof Err.Report) {
        throw error.prepend(
          "infer_ap fail on Value.Pi\n" +
            `target: ${pretty.pretty_exp(target)}\n` +
            `infered type: ${pretty.pretty_value(t_infered)}\n` +
            `args: ${args.map(pretty.pretty_exp).join(", ")}\n`
        )
      } else {
        throw error
      }
    }
  } else if (t_infered instanceof Value.Type) {
    let target_value = evaluate(env, target)

    if (target_value instanceof Value.Cl) {
      let { defined, scope, scope_env } = target_value
      if (args.length > scope.arity) {
        throw new Err.Report([
          "too many arguments to apply class\n" +
            `length of args: ${args.length}\n` +
            `arity of cl: ${scope.arity}\n`,
        ])
      }

      Scope.scope_check_with_args(scope, scope_env, args, env)
      return new Value.Type()
    } else {
      throw new Err.Report([
        `expecting Value.Cl but found: ${pretty.pretty_value(t_infered)}\n`,
      ])
    }
  } else {
    throw new Err.Report([
      `expecting type of function-like value\n` +
        `but found type: ${pretty.pretty_value(t_infered)}\n`,
    ])
  }
}

export function infer_dot(
  env: Env.Env,
  target: Exp.Exp,
  field_name: string
): Value.Value {
  let t_infered = infer(env, target)

  if (t_infered instanceof Value.Cl) {
    let { defined, scope, scope_env } = t_infered

    // CASE found `m` in `defined`
    // { ..., m = d : T, ... } @ scope_env = infer(env, e)
    // ------
    // infer(env, e.m) = T

    let the = defined.get(field_name)

    if (the !== undefined) {
      return the.t
    }

    // CASE found `m` in `scope`
    // { x1 : A1,
    //   x2 : A2, ...
    //   m : T, ... } @ scope_env = infer(env, e)
    // scope_env = scope_env.ext(x1, evaluate(scope_env, T), NeutralVar(x1))
    // ...
    // T_value = evaluate(scope_env, T)
    // ------
    // infer(env, e.m) = T_value

    let result: undefined | Value.Value = undefined

    Scope.scope_check(scope, scope_env, (name, the) => {
      // NOTE the last one will be the result
      if (name === field_name) {
        result = the.t
      }
    })

    if (result !== undefined) {
      return result
    } else {
      throw new Err.Report([
        "infer_dot fail\n" +
          "on Value.Cl\n" +
          `target exp: ${pretty.pretty_exp(target)}\n` +
          `infered target type: ${pretty.pretty_value(t_infered)}\n` +
          `can not find field_name for dot: ${field_name}\n`,
      ])
    }
  } else {
    throw new Err.Report([
      "expecting class\n" +
        `found type: ${pretty.pretty_value(t_infered)}\n` +
        `target: ${pretty.pretty_exp(target)}\n`,
    ])
  }
}
