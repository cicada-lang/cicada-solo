import * as Exp from "./exp"
import * as Value from "./value"
import * as Env from "./env"
import * as Scope from "./scope"
import { check } from "./check"
import { infer } from "./infer"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
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
    let { scope, return_value } = exp
    return new Value.Fn(scope, return_value, env)
  }

  else if (exp instanceof Exp.FnCase) {
    let { cases } = exp
    return new Value.FnCase(cases.map(fn => new Value.Fn(fn.scope, fn.return_value, env)))
  }

  else if (exp instanceof Exp.Ap) {
    let { target, args } = exp
    return evaluate_ap(env, target, args)
  }

  else if (exp instanceof Exp.Cl) {
    let { scope } = exp
    // TODO need initial evaluate
    //   defined might not be empty
    let defined = new Map()
    return new Value.Cl(defined, scope, env)
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
    // TODO
    // case Block(block_entry_map: ListMap[String, BlockEntry], body: Exp) =>
    //   var local_env = env
    //   block_entry_map.foreach {
    //     case (name, BlockEntryLet(exp)) =>
    //       local_env = local_env.ext(name, infer(local_env, exp), evaluate(local_env, exp))
    //     case (name, BlockEntryDefine(t, exp)) =>
    //       local_env = local_env.ext(name, evaluate(local_env, t), evaluate(local_env, exp))
    //   }
    //   evaluate(local_env, body)
    throw new Error("TODO")
  }

  else {
    throw new Error(
      "evaluate fail\n" +
        `unhandled class of Exp: ${exp.constructor.name}\n`)
  }
}

export function evaluate_ap(env: Env.Env, target: Exp.Exp, args: Array<Exp.Exp>): Value.Value {
  throw new Error("TODO")
}

export function evaluate_obj(env: Env.Env, scope: Scope.Scope): Value.Value {
  let local_env = env
  let defined = new Map()

  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let the = {
        t: infer(local_env, value),
        value: evaluate(local_env, value),
      }
      local_env.ext(name, the)
      defined.set(name, the)
    }

    else if (entry instanceof Scope.Entry.Given) {
      throw new Error(
        "evaluate_obj fail\n" +
          `scope of Exp.Obj should not contain Entry.Given\n`)
    }

    else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      let the = {
        t: evaluate(local_env, t),
        value: evaluate(local_env, value),
      }
      local_env.ext(name, the)
      defined.set(name, the)
    }

    else {
      throw new Error(
        "evaluate_obj fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`)
    }
  }

  return new Value.Obj(defined)
}

export function evaluate_dot(env: Env.Env, target: Exp.Exp, field: string): Value.Value {
  throw new Error("TODO")
}
