import * as Exp from "./exp"
import * as Value from "./value"
import * as Env from "./env"
import * as Scope from "./scope"
import { Report } from "./report"
import { check } from "./check"
import { infer } from "./infer"
import * as pretty from "./pretty"

export function evaluate(
  env: Env.Env,
  exp: Exp.Exp,
): Value.Value {
  if (exp instanceof Exp.Var) {
    let { name } = exp
    let value = env.lookup_value(name)
    return value ? value : new Value.Neutral.Var(name)
  }

  else if (exp instanceof Exp.Type) {
    return new Value.Type()
  }

  else if (exp instanceof Exp.StrType) {
    return new Value.StrType()
  }

  else if (exp instanceof Exp.Str) {
    let { str } = exp
    return new Value.Str(str)
  }

  else if (exp instanceof Exp.Pi) {
    let { scope, return_type } = exp
    return new Value.Pi(scope, return_type, env)
  }

  else if (exp instanceof Exp.Fn) {
    let { scope, body } = exp
    return new Value.Fn(scope, body, env)
  }

  else if (exp instanceof Exp.FnCase) {
    let { cases } = exp
    return new Value.FnCase(cases.map(fn => new Value.Fn(fn.scope, fn.body, env)))
  }

  else if (exp instanceof Exp.Ap) {
    let { target, args } = exp
    return evaluate_ap(env, target, args)
  }

  else if (exp instanceof Exp.Cl) {
    let { scope } = exp
    return evaluate_cl(env, scope)
  }

  else if (exp instanceof Exp.Obj) {
    let { scope } = exp
    return evaluate_obj(env, scope)
  }

  else if (exp instanceof Exp.Dot) {
    let { target, field } = exp
    return evaluate_dot(env, target, field)
  }

  else if (exp instanceof Exp.Block) {
    let { scope, body } = exp
    return evaluate_block(env, scope, body)
  }

  else {
    throw new Report([
      "evaluate fail\n" +
        `unhandled class of Exp: ${exp.constructor.name}\n`])
  }
}

export function evaluate_obj(
  env: Env.Env,
  scope: Scope.Scope,
): Value.Value {
  let local_env = env
  let defined = new Map()

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(local_env, value),
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
      defined.set(name, the)
    }

    else if (entry instanceof Scope.Entry.Given) {
      throw new Report([
        "evaluate_obj fail\n" +
          `scope of Exp.Obj should not contain Entry.Given\n`])
    }

    else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(local_env, t),
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
      defined.set(name, the)
    }

    else {
      throw new Report([
        "evaluate_obj fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`])
    }
  }

  return new Value.Obj(defined)
}

export function evaluate_cl(
  env: Env.Env,
  scope: Scope.Scope,
): Value.Value {
  let local_env = env
  let defined = new Map()
  let named_entries: Array<[string, Scope.Entry.Entry]> = []
  let init_definition_finished_p = false

  for (let [name, entry] of scope.named_entries) {
    if (init_definition_finished_p) {
      named_entries.push([name, entry])
    }

    else {
      if (entry instanceof Scope.Entry.Let) {
        let { value } = entry
        let the = {
          t: infer(local_env, value),
          value: evaluate(local_env, value),
        }
        local_env = local_env.ext(name, the)
        defined.set(name, the)
      }

      else if (entry instanceof Scope.Entry.Given) {
        named_entries.push([name, entry])
        init_definition_finished_p = true
      }

      else if (entry instanceof Scope.Entry.Define) {
        let { t, value } = entry
        let the = {
          t: evaluate(local_env, t),
          value: evaluate(local_env, value),
        }
        local_env = local_env.ext(name, the)
        defined.set(name, the)
      }

      else {
        throw new Report([
          "evaluate_cl fail\n" +
            `unhandled class of Scope.Entry: ${entry.constructor.name}\n`])
      }
    }
  }

  return new Value.Cl(defined, new Scope.Scope(named_entries), local_env)
}

export function evaluate_block(
  env: Env.Env,
  scope: Scope.Scope,
  body: Exp.Exp,
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
    }

    else if (entry instanceof Scope.Entry.Given) {
      throw new Report([
        "evaluate_block fail\n" +
          `scope of Exp.Obj should not contain Entry.Given\n`])
    }

    else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(local_env, t),
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
    }

    else {
      throw new Report([
        "evaluate_block fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`])
    }
  }

  return evaluate(local_env, body)
}

function scope_check_args(
  scope: Scope.Scope,
  scope_env: Env.Env,
  args: Array<Exp.Exp>,
  env: Env.Env,
  effect: (name: string, the: {
    t: Value.Value,
    value: Value.Value,
  }) => void = (name, the) => {},
): Env.Env {
  let arg_index = 0

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(scope_env, value),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    }

    else if (entry instanceof Scope.Entry.Given) {
      let arg = args[arg_index]
      if (arg === undefined) {
        break
      }
      arg_index += 1
      let { t } = entry
      let t_value = evaluate(scope_env, t)
      check(env, arg, t_value)
      let arg_value = evaluate(env, arg) // NOTE use the original `env`
      let the = {
        t: t_value,
        value: arg_value,
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    }

    else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(scope_env, t),
        value: evaluate(scope_env, value),
      }
      scope_env = scope_env.ext(name, the)
      effect(name, the)
    }

    else {
      throw new Report([
        "scope_check_args fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`])
    }
  }

  return scope_env
}

export function evaluate_ap(
  env: Env.Env,
  target: Exp.Exp,
  args: Array<Exp.Exp>,
): Value.Value {
  let target_value = evaluate(env, target)

  if (target_value instanceof Value.Neutral.Neutral) {
    return new Value.Neutral.Ap(target_value, args.map(arg => evaluate(env, arg)))
  }

  else if (target_value instanceof Value.Fn) {
    let { scope, body, env: scope_env } = target_value

    if (scope.arity !== args.length) {
      throw new Report([
        "evaluate_ap fail\n" +
          "Value.Fn arity mismatch\n" +
          `scope.arity: ${scope.arity}\n` +
          `args.length: ${args.length}\n`])
    }

    let new_scope_env = scope_check_args(scope, scope_env, args, env)

    return evaluate(new_scope_env, body)
  }

  else if (target_value instanceof Value.FnCase) {
    let { cases } = target_value

    // NOTE find the first checked case
    let fn = cases.find(fn => {
      let { scope, env: scope_env } = fn
      try {
        if (scope.arity !== args.length) {
          throw new Report([
            "evaluate_ap fail\n" +
              "Value.FnCase arity mismatch\n" +
              `scope.arity: ${scope.arity}\n` +
              `args.length: ${args.length}\n`])
        }

        scope_check_args(scope, scope_env, args, env)

        return true
      }

      catch(error) {
        if (error instanceof Report) {
          return false
        }
        else {
          throw error
        }
      }
    })

    if (fn === undefined) {
      let s = args.map(pretty.pretty_exp).join(", ")
      throw new Report([
        "evaluate_ap fail\n" +
          "Value.FnCase mismatch\n" +
          `target_value: ${pretty.pretty_value(target_value)}\n` +
          `args: (${s})\n`])
    }

    else {
      return evaluate_ap(env, fn, args)
    }
  }

  else if (target_value instanceof Value.Cl) {
    let { defined, scope, env: scope_env } = target_value

    if (scope.arity < args.length) {
      throw new Report([
        "evaluate_ap fail\n" +
          "too many arguments\n" +
          `scope.arity: ${scope.arity}\n` +
          `args.length: ${args.length}\n`])
    }

    let new_defined = new Map([...defined])
    let new_named_entries = Array.from(scope.named_entries)
    let new_scope_env = scope_check_args(
      scope, scope_env, args, env,
      (name, the) => {
        new_defined.set(name, the)
        new_named_entries.shift()
      })

    return new Value.Cl(
      new_defined,
      new Scope.Scope(new_named_entries),
      new_scope_env)
  }

  else {
    throw new Report([
      "evaluate_ap fail\n" +
        "expecting a Value class that can be applied as function\n" +
        `while found Value of class: ${target_value.constructor.name}\n`])
  }
}

export function evaluate_dot(
  env: Env.Env,
  target: Exp.Exp,
  field: string,
): Value.Value {
  let target_value = evaluate(env, target)

  if (target_value instanceof Value.Neutral.Neutral) {
    return new Value.Neutral.Dot(target_value, field)
  }

  else if (target_value instanceof Value.Obj) {
    let { defined } = target_value
    let the = defined.get(field)

    if (the === undefined) {
      throw new Report([
        "evaluate_dot fail\n" +
          `missing field: ${field}\n` +
          `target_value: ${pretty.pretty_value(target_value)}\n`])
    }

    else {
      return the.value
    }
  }

  else {
    throw new Report([
      "evaluate_dot fail\n" +
        "expecting Value.Obj\n" +
        `while found Value of class: ${target_value.constructor.name}\n`])
  }
}
