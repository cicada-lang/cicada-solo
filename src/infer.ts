import * as Exp from "./exp"
import * as Value from "./value"
import * as Env from "./env"
import * as Scope from "./scope"
import { Report } from "./report"
import { evaluate } from "./evaluate"
import { check } from "./check"
import { readback } from "./readback"
import * as pretty from "./pretty"

export function infer(
  env: Env.Env,
  exp: Exp.Exp,
): Value.Value {
  try {
    if (exp instanceof Exp.Var) {
      let { name } = exp
      let t = env.lookup_type(name)
      if (t === undefined) {
        throw new Report([
          `can not find var: ${name} in env\n`])
      }
      else {
        return t
      }
    }

    else if (exp instanceof Exp.Type) {
      return new Value.Type()
    }

    else if (exp instanceof Exp.StrType) {
      return new Value.Type()
    }

    else if (exp instanceof Exp.Str) {
      return new Value.StrType()
    }

    else if (exp instanceof Exp.Pi) {
      let { scope, return_type } = exp

      // check(local_env, A1, type)
      // local_env = local_env.ext(x1, evaluate(local_env, A1), NeutralVar(x1))
      // ...
      // check(local_env, R, type)
      // ------
      // infer(local_env, { x1 : A1, x2 : A2, ... -> R }) = type

      let local_env = scope_check(env, scope)
      check(local_env, return_type, new Value.Type())
      return new Value.Type()
    }

    else if (exp instanceof Exp.Fn) {
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

      let local_env = scope_check(env, scope)
      let return_type_value = infer(local_env, body)
      let return_type = readback(return_type_value)
      return new Value.Pi(scope, return_type, env) // NOTE use `env` instead of `local_env`
    }

    else if (exp instanceof Exp.FnCase) {
      throw new Report([
        `the language is not designed to infer the type of Exp.FnCase: ${exp}\n`])
    }

    else if (exp instanceof Exp.Cl) {
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

      scope_check(env, scope)
      return new Value.Type()
    }

    else if (exp instanceof Exp.Obj) {
      let { scope } = exp

      // A1 = infer(local_env, a1)
      // a1_value = evaluate(local_env, a1)
      // local_env = local_env.ext(x1, a1_value, A1)
      // ...
      // ------
      // infer(local_env, { x1 = a1, x2 = a2, ... }) =
      //   { x1 = a1_value : A1, x2 = a2_value : A2, ... } @ local_env

      let defined = new Map()
      let local_env = scope_check(env, scope, (name, the) => {
        defined.set(name, the)
      })
      return new Value.Cl(defined, new Scope.Scope([]), local_env)
    }

    else if (exp instanceof Exp.Ap) {
      let { target, args } = exp
      return infer_ap(env, target, args)
    }

    else if (exp instanceof Exp.Dot) {
      let { target, field_name } = exp
      return infer_dot(env, target, field_name)
    }

    else if (exp instanceof Exp.Block) {
      let { scope, body } = exp
      let local_env = scope_check(env, scope)
      return infer(local_env, body)
    }

    else {
      throw new Report([
        "infer fail\n" +
          `unhandled class of Exp: ${exp.constructor.name}\n`])
    }
  }

  catch(error) {
    if (error instanceof Report) {
      throw error.prepend(
        "infer fail\n" +
          `exp: ${pretty.pretty_exp(exp)}\n` +
          `value: ${pretty.pretty_value(evaluate(env, exp))}\n`)
    }

    else {
      throw error
    }
  }
}

function scope_check(
  env: Env.Env,
  scope: Scope.Scope,
  effect: (name: string, the: {
    t: Value.Value,
    value: Value.Value,
  }) => void = (name, the) => {},
): Env.Env {
  var local_env = env
  for (let [name, entry] of scope.named_entries) {
    if (entry instanceof Scope.Entry.Let) {
      let { value } = entry
      let t_value = infer(local_env, value)
      let the = {
        t: t_value,
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
      effect(name, the)
    }

    else if (entry instanceof Scope.Entry.Given) {
      let { t } = entry
      check(local_env, t, new Value.Type())
      let the = {
        t: evaluate(local_env, t),
        value: new Value.Neutral.Var(name),
      }
      local_env = local_env.ext(name, the)
      effect(name, the)
    }

    else if (entry instanceof Scope.Entry.Define) {
      let { t, value } = entry
      check(local_env, t, new Value.Type())
      let t_value = evaluate(local_env, t)
      check(local_env, value, t_value)
      let the = {
        t: t_value,
        value: evaluate(local_env, value),
      }
      local_env = local_env.ext(name, the)
      effect(name, the)
    }

    else {
      throw new Error(
        "scope_check fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`)
    }
  }

  return local_env
}

export function infer_ap(
  env: Env.Env,
  target: Exp.Exp,
  args: Array<Exp.Exp>,
): Value.Value {
  // infer(env, target) match {
  //   // { x1 : A1, x2 : A2, ... -> R } @ telescope_env = infer(env, f)
  //   // A1_value = evaluate(telescope_env, A1)
  //   // check(env, a1, A1_value)
  //   // telescope_env = telescope_env.ext(x1, A1_value, evaluate(env, a1))
  //   // ...
  //   // ------
  //   // infer(env, f(a1, a2, ...)) = evaluate(telescope_env, R)
  //   case ValuePi(telescope: Telescope, return_type: Exp) =>
  //     if (args.length != telescope.size) {
  //       throw Report(List(
  //         s"args and pi type arity mismatch\n" +
  //           s"arity of args: ${args.length}\n" +
  //           s"arity of pi: ${telescope.size}\n"
  //       ))
  //     }
  //     var telescope_env = telescope.env
  //     telescope.type_map.zip(args).foreach {
  //       case ((name, t), arg) =>
  //         val t_value = evaluate(telescope_env, t)
  //         check(env, arg, t_value)
  //         telescope_env = telescope_env.ext(name, t_value, evaluate(env, arg))
  //     }
  //     evaluate(telescope_env, return_type)

  //   case ValueType() =>
  //     evaluate(env, target) match {
  //       case ValueCl(defined, telescope) =>
  //         if (args.length > telescope.size) {
  //           throw Report(List(
  //             s"too many arguments to apply class\n" +
  //               s"length of args: ${args.length}\n" +
  //               s"arity of cl: ${telescope.size}\n"
  //           ))
  //         }
  //         var telescope_env = telescope.env
  //         telescope.type_map.zip(args).foreach {
  //           case ((name, t), arg) =>
  //             val t_value = evaluate(telescope_env, t)
  //             check(env, arg, t_value)
  //             telescope_env = telescope_env.ext(name, evaluate(env, arg), t_value)
  //         }
  //         ValueType()

  //       case t =>
  //         throw Report(List(
  //           s"expecting ValueCl but found: ${t}\n"
  //         ))
  //     }

  //   case t =>
  //     throw Report(List(
  //       s"expecting ValuePi type but found: ${t}\n"
  //     ))
  // }

  throw new Error("TODO")
}


export function infer_dot(
  env: Env.Env,
  target: Exp.Exp,
  field_name: string,
): Value.Value {
  // val t_infered = infer(env, target)
  // t_infered match {
  //   case ValueCl(defined, telescope) =>
  //     // CASE found `m` in `defined`
  //     // { ..., m = d : T, ... } @ telescope_env = infer(env, e)
  //     // ------
  //     // infer(env, e.m) = T
  //     // CASE found `m` in `telescope`
  //     // { x1 : A1,
  //     //   x2 : A2, ...
  //     //   m : T, ... } @ telescope_env = infer(env, e)
  //     // telescope_env = telescope_env.ext(x1, evaluate(telescope_env, T), NeutralVar(x1))
  //     // ...
  //     // T_value = evaluate(telescope_env, T)
  //     // ------
  //     // infer(env, e.m) = T_value
  //     defined.get(field_name) match {
  //       case Some((t, _v)) => t
  //       case None =>
  //         var result: Option[Value] = None
  //         var telescope_env = telescope.env
  //         telescope.type_map.foreach {
  //           case (name, t) =>
  //             if (name == field_name) {
  //               result = Some(evaluate(telescope_env, t))
  //             }
  //             telescope_env = telescope_env.ext(name, evaluate(telescope_env, t), NeutralVar(name))
  //         }
  //         result match {
  //           case Some(t) => t
  //           case None =>
  //             throw Report(List(
  //               s"infer fail\n" +
  //                 s"on ValueCl\n" +
  //                 s"target exp: ${pretty_exp(target)}\n" +
  //                 s"infered target type: ${pretty_value(t_infered)}\n" +
  //                 s"can not find field_name for dot: ${field_name}\n"
  //             ))
  //         }
  //     }

  //   case t =>
  //     throw Report(List(
  //       s"expecting class\n" +
  //         s"found type: ${pretty_value(t)}\n" +
  //         s"target: ${pretty_exp(target)}\n"
  //     ))
  // }

  throw new Error("TODO")
}
