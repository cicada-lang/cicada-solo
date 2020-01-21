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
      local_env.ext(name, the)
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
      local_env.ext(name, the)
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
    } else {
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
        named_entries.push([name, entry])
        init_definition_finished_p = true
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
      local_env.ext(name, the)
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
      local_env.ext(name, the)
    }

    else {
      throw new Report([
        "evaluate_block fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`])
    }
  }

  return evaluate(local_env, body)
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
    // case ValueFn(telescope: Telescope, body: Exp) =>
    //   if (telescope.size != args.length) {
    //     throw Report(List(
    //       "evaluate_ap fail, ValueFn arity mismatch\n"
    //     ))
    //   }
    //   var local_env = env
    //   var telescope_env = telescope.env
    //   telescope.type_map.zip(args).foreach {
    //     case ((name, t), arg) =>
    //       val t_value = evaluate(telescope_env, t)
    //       check(env, arg, t_value)
    //       val arg_value = evaluate(env, arg) // NOTE use the original `env`
    //       local_env = local_env.ext(name, t_value, arg_value)
    //       telescope_env = telescope_env.ext(name, t_value, arg_value)
    //   }
    //   evaluate(local_env, body)
    throw new Error("TODO")
  }

  else if (target_value instanceof Value.FnCase) {
    // case ValueFnCase(cases) =>
    //   cases.find {
    //     case (telescope, _body) =>
    //       // NOTE find the first checked case
    //       Try {
    //         if (telescope.size != args.length) {
    //           throw Report(List(
    //             "evaluate_ap fail, ValueFnCase arity mismatch\n"
    //           ))
    //         }
    //         var telescope_env = telescope.env
    //         telescope.type_map.zip(args).foreach {
    //           case ((name, t), arg) =>
    //             val t_value = evaluate(telescope_env, t)
    //             val arg_value = evaluate(env, arg)
    //             val arg_norm = readback(arg_value)
    //             check(env, arg_norm, t_value) // NOTE use the original `env`
    //             telescope_env = telescope_env.ext(name, t_value, arg_value)
    //         }
    //       } match {
    //         case Success(_ok) => true
    //         case Failure(_error) => false
    //       }
    //   } match {
    //     case Some((telescope, body)) =>
    //       var local_env = env
    //       var telescope_env = telescope.env
    //       telescope.type_map.zip(args).foreach {
    //         case ((name, t), arg) =>
    //           val t_value = evaluate(telescope_env, t)
    //           val arg_value = evaluate(env, arg)
    //           local_env = local_env.ext(name, t_value, arg_value)
    //           telescope_env = telescope_env.ext(name, t_value, arg_value)
    //       }
    //       evaluate(local_env, body)
    //     case None =>
    //       val args_repr = args.map { pretty_exp }.mkString(", ")
    //       throw Report(List(
    //         "evaluate_ap fail, ValueFnCase mismatch\n" +
    //           s"target_value: ${pretty_value(target_value)}\n" +
    //           s"args: (${args_repr})\n"
    //       ))
    //   }
    throw new Error("TODO")
  }

  else if (target_value instanceof Value.Cl) {
    // case ValueCl(defined, telescope: Telescope) =>
    //   if (telescope.size < args.length) {
    //     throw Report(List(
    //       s"evaluate_ap fail\n" +
    //         s"too many arguments\n"
    //     ))
    //   }
    //   var telescope_env = telescope.env
    //   var new_defined: ListMap[String, (Value, Value)] = ListMap()
    //   var new_type_map = telescope.type_map
    //   telescope.type_map.zip(args).foreach {
    //     case ((name, t), arg) =>
    //       val t_value = evaluate(telescope_env, t)
    //       check(env, arg, t_value)
    //       val arg_value = evaluate(env, arg)
    //       new_defined = new_defined + (name -> (t_value, arg_value))
    //       telescope_env = telescope_env.ext(name, t_value, arg_value)
    //       new_type_map = new_type_map.tail
    //   }
    //   ValueCl(defined ++ new_defined, Telescope(new_type_map, telescope_env))
    throw new Error("TODO")
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
