import assert from "assert"
import * as Exp from "./exp"
import * as Value from "./value"
import * as Neutral from "./neutral"
import * as Env from "./env"
import * as Scope from "./scope"
import * as Err from "./err"
import { check } from "./check"
import { infer } from "./infer"
import * as pretty from "./pretty"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  if (exp instanceof Exp.Var) {
    let { name } = exp
    let value = env.lookup_value(name)

    if (value !== undefined) {
      return value
    } else {
      throw new Err.Report(["evaluate fail\n" + `undefined name: ${name}\n`])
    }
  } else if (exp instanceof Exp.Type) {
    return new Value.Type()
  } else if (exp instanceof Exp.StrType) {
    return new Value.StrType()
  } else if (exp instanceof Exp.Str) {
    let { str } = exp
    return new Value.Str(str)
  } else if (exp instanceof Exp.Pi) {
    let { scope, return_type } = exp
    return new Value.Pi(scope, return_type, env)
  } else if (exp instanceof Exp.Fn) {
    let { scope, body } = exp
    return new Value.Fn(scope, body, env)
  } else if (exp instanceof Exp.FnCase) {
    let { cases } = exp
    return new Value.FnCase(
      cases.map((fn) => new Value.Fn(fn.scope, fn.body, env))
    )
  } else if (exp instanceof Exp.Ap) {
    let { target, args } = exp
    return eliminate_ap(env, evaluate(env, target), args)
  } else if (exp instanceof Exp.Cl) {
    let { scope } = exp
    return evaluate_cl(env, scope)
  } else if (exp instanceof Exp.Obj) {
    let { scope } = exp
    return evaluate_obj(env, scope)
  } else if (exp instanceof Exp.Dot) {
    let { target, field_name } = exp
    return eliminate_dot(env, evaluate(env, target), field_name)
  } else if (exp instanceof Exp.Block) {
    let { scope, body } = exp
    return evaluate_block(env, scope, body)
  } else if (exp instanceof Exp.The) {
    let { value } = exp
    return evaluate(env, value)
  } else if (exp instanceof Exp.Equation) {
    let { t, lhs, rhs } = exp
    return new Value.Equation(evaluate(env, t), lhs, rhs, env)
  } else if (exp instanceof Exp.Same) {
    let { t, value } = exp
    return new Value.Same(evaluate(env, t), evaluate(env, value))
  } else if (exp instanceof Exp.Transport) {
    let { equation, motive, base } = exp
    return eliminate_transport(env, evaluate(env, equation), motive, base)
  } else {
    throw new Err.Unhandled(exp)
  }
}

export function evaluate_obj(env: Env.Env, scope: Scope.Scope): Value.Value {
  // NOTE no telescope semantics here
  //   no `local_env`
  //   just use `env`

  let defined = new Map()

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(env, value),
        value: evaluate(env, value),
      }
      defined.set(name, the)
    } else if (entry instanceof Scope.Entry.Given) {
      throw new Err.Report([
        "evaluate_obj fail\n" +
          `scope of Exp.Obj should not contain Entry.Given\n` +
          `scope: ${pretty.pretty_scope(scope, ", ")}\n` +
          `name: ${name}\n`,
      ])
    } else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(env, t),
        value: evaluate(env, value),
      }
      defined.set(name, the)
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return new Value.Obj(defined)
}

export function evaluate_cl(env: Env.Env, scope: Scope.Scope): Value.Value {
  let scope_env = env
  let defined = new Map()
  let named_entries: Array<[string, Scope.Entry.Entry]> = []
  let init_definition_finished_p = false

  for (let [name, entry] of scope.named_entries) {
    if (init_definition_finished_p) {
      named_entries.push([name, entry])
    } else {
      if (entry instanceof Scope.Entry.Let) {
        let { value } = entry
        let the = {
          t: infer(scope_env, value),
          value: evaluate(scope_env, value),
        }
        scope_env = scope_env.ext(name, the)
        defined.set(name, the)
      } else if (entry instanceof Scope.Entry.Given) {
        named_entries.push([name, entry])
        init_definition_finished_p = true
      } else if (entry instanceof Scope.Entry.Define) {
        let { t, value } = entry
        let the = {
          t: evaluate(scope_env, t),
          value: evaluate(scope_env, value),
        }
        scope_env = scope_env.ext(name, the)
        defined.set(name, the)
      } else {
        throw new Err.Unhandled(entry)
      }
    }
  }

  return new Value.Cl(defined, new Scope.Scope(named_entries), scope_env)
}

export function evaluate_block(
  env: Env.Env,
  scope: Scope.Scope,
  body: Exp.Exp
): Value.Value {
  let local_env = env

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(local_env, value),
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
    } else if (entry instanceof Scope.Entry.Given) {
      throw new Err.Report([
        "evaluate_block fail\n" +
          `scope of block should not contain Entry.Given\n`,
      ])
    } else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(local_env, t),
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return evaluate(local_env, body)
}

export function eliminate_ap(
  env: Env.Env,
  target: Value.Value,
  args: Array<Exp.Exp>
): Value.Value {
  if (target instanceof Value.TheNeutral) {
    let the = target

    if (the.t instanceof Value.Pi) {
      let pi = the.t
      let scope_env = Scope.scope_check_with_args(
        pi.scope,
        pi.scope_env,
        args,
        env
      )
      return new Value.TheNeutral(
        evaluate(scope_env, pi.return_type),
        new Neutral.Ap(
          the.value,
          args.map((arg) => evaluate(env, arg))
        )
      )
    } else {
      throw new Err.Report([
        "eliminate_ap fail\n" +
          "target type is not Value.Pi\n" +
          `target: ${pretty.pretty_value(target)}\n`,
      ])
    }
  } else if (target instanceof Value.Fn) {
    let { scope, body, scope_env } = target

    if (scope.arity !== args.length) {
      let args_str = args.map(pretty.pretty_exp).join(", ")
      throw new Err.Report([
        "eliminate_ap fail\n" +
          "Value.Fn arity mismatch\n" +
          `scope.arity: ${scope.arity}\n` +
          `args.length: ${args.length}\n` +
          `target: ${pretty.pretty_value(target)}\n` +
          `args: (${args_str})\n`,
      ])
    }

    let new_scope_env = Scope.scope_check_with_args_for_fn(
      scope,
      scope_env,
      args,
      env
    )
    return evaluate(new_scope_env, body)
  } else if (target instanceof Value.FnCase) {
    let { cases } = target

    // NOTE find the first checked case
    let fn = cases.find((fn) => {
      let { scope, scope_env } = fn
      try {
        if (scope.arity !== args.length) {
          throw new Err.Report([
            "eliminate_ap fail\n" +
              "Value.FnCase arity mismatch\n" +
              `scope.arity: ${scope.arity}\n` +
              `args.length: ${args.length}\n`,
          ])
        }

        Scope.scope_check_with_args_for_fn(scope, scope_env, args, env)
        return true
      } catch (error) {
        if (error instanceof Err.Report) {
          // {
          //   console.log("<eliminate_ap:Value.FnCase>")
          //   console.log(error.message, "</eliminate_ap:Value.FnCase>")
          //   console.log()
          // }
          return false
        } else {
          throw error
        }
      }
    })

    if (fn === undefined) {
      let s = args.map(pretty.pretty_exp).join(", ")
      let v = args
        .map((arg) => pretty.pretty_value(evaluate(env, arg)))
        .join(", ")

      // NOTE instead of error, should we return Neutral here?

      throw new Err.Report([
        "eliminate_ap fail\n" +
          "Value.FnCase args mismatch\n" +
          `target: ${pretty.pretty_value(target)}\n` +
          `args: (${s})\n` +
          `arg values: (${v})\n`,
      ])
    } else {
      return eliminate_ap(env, fn, args)
    }
  } else if (target instanceof Value.Cl) {
    let { defined, scope, scope_env } = target

    if (scope.arity < args.length) {
      throw new Err.Report([
        "eliminate_ap fail\n" +
          "too many arguments\n" +
          `scope.arity: ${scope.arity}\n` +
          `args.length: ${args.length}\n`,
      ])
    }

    let new_defined = new Map([...defined])
    let new_named_entries = Array.from(scope.named_entries)
    let new_scope_env = Scope.scope_check_with_args(
      scope,
      scope_env,
      args,
      env,
      (name, the) => {
        new_defined.set(name, the)
        new_named_entries.shift()
      }
    )

    return new Value.Cl(
      new_defined,
      new Scope.Scope(new_named_entries),
      new_scope_env
    )
  } else {
    throw new Err.Report([
      "eliminate_ap fail\n" +
        "expecting a value that can be applied as function\n" +
        `while found value of class: ${target.constructor.name}\n`,
    ])
  }
}

export function eliminate_transport(
  env: Env.Env,
  target: Value.Value,
  motive: Exp.Exp,
  base: Exp.Exp
): Value.Value {
  if (target instanceof Value.TheNeutral) {
    let the = target

    if (the.t instanceof Value.Equation) {
      let { t, lhs, rhs, equation_env } = the.t
      let base_value = evaluate(env, base)
      let motive_value = evaluate(env, motive)
      return new Value.TheNeutral(
        eliminate_ap(equation_env, motive_value, [rhs]),
        new Neutral.Transport(the.value, motive_value, base_value)
      )
    } else {
      throw new Err.Report([
        "eliminate_transport fail\n" +
          "target type is not Value.Equation\n" +
          `target: ${pretty.pretty_value(target)}\n`,
      ])
    }
  } else if (target instanceof Value.Same) {
    return evaluate(env, base)
  } else {
    throw new Err.Report([
      "eliminate_transport fail\n" +
        "expecting target to be Value.Equation\n" +
        `while found Value of class: ${target.constructor.name}\n`,
    ])
  }
}

export function eliminate_dot(
  env: Env.Env,
  target: Value.Value,
  field_name: string
): Value.Value {
  if (target instanceof Value.TheNeutral) {
    let the = target
    return new Value.TheNeutral(
      eliminate_dot(env, the.t, field_name),
      new Neutral.Dot(the.value, field_name)
    )
  }

  if (target instanceof Value.Obj) {
    let { defined } = target
    let the = defined.get(field_name)

    if (the !== undefined) {
      return the.value
    } else {
      throw new Err.Report([
        "eliminate_dot fail\n" +
          "on Value.Obj\n" +
          `missing field_name: ${field_name}\n` +
          `target: ${pretty.pretty_value(target)}\n`,
      ])
    }
  } else if (target instanceof Value.Cl) {
    let { scope, defined, scope_env } = target

    let the = defined.get(field_name)
    if (the !== undefined) {
      return the.t
    }

    let type_map = scope_to_type_map(scope, scope_env)
    let t = type_map.get(field_name)
    if (t !== undefined) {
      return t
    }

    throw new Err.Report([
      "eliminate_dot fail\n" +
        "on Value.Cl\n" +
        `missing field_name: ${field_name}\n` +
        `target: ${pretty.pretty_value(target)}\n`,
    ])
  } else {
    throw new Err.Report([
      "eliminate_dot fail\n" +
        "expecting object or class\n" +
        `while found Value of class: ${target.constructor.name}\n` +
        `target: ${pretty.pretty_value(target)}\n`,
    ])
  }
}

export function scope_to_type_map(
  scope: Scope.Scope,
  scope_env: Env.Env
): Map<string, Value.Value> {
  let type_map = new Map()

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(scope_env, value),
        value: evaluate(scope_env, value),
      }
      type_map.set(name, the.t)
      scope_env = scope_env.ext(name, the)
    } else if (entry instanceof Scope.Entry.Given) {
      let { t } = entry
      let t_value = evaluate(scope_env, t)
      let the = {
        t: t_value,
        value: new Value.TheNeutral(t_value, new Neutral.Var(name)),
      }
      type_map.set(name, the.t)
      scope_env = scope_env.ext(name, the)
    } else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(scope_env, t),
        value: evaluate(scope_env, value),
      }
      type_map.set(name, the.t)
      scope_env = scope_env.ext(name, the)
    } else {
      throw new Err.Unhandled(entry)
    }
  }

  return type_map
}
