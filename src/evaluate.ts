import * as Exp from "./exp"
import * as Value from "./value"
import * as Env from "./env"
import * as Scope from "./scope"
import { check } from "./check"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {

  if (exp instanceof Exp.Var) {
    let { name } = exp
    let value = env.lookup_value(name)
    return value ? value : new Value.Neutral.Var(name)
  }

  if (exp instanceof Exp.Type) {
    return new Value.Type()
  }

  if (exp instanceof Exp.StrType) {
    return new Value.StrType()
  }

  if (exp instanceof Exp.Str) {
    let { str } = exp
    return new Value.Str(str)
  }

  if (exp instanceof Exp.Pi) {
    let { scope, return_type } = exp
    return new Value.Pi(scope, return_type, env)
  }

  if (exp instanceof Exp.Fn) {
    let { scope, return_value } = exp
    return new Value.Fn(scope, return_value, env)
  }

  if (exp instanceof Exp.FnCase) {
    let { cases } = exp
    return new Value.FnCase(cases.map(fn => new Value.Fn(fn.scope, fn.return_value, env)))
  }

  if (exp instanceof Exp.Ap) {
    let { target, args } = exp
    return evaluate_ap(env, target, args)
  }

  if (exp instanceof Exp.Cl) {
    let { scope } = exp
    return new Value.Cl(scope, env)
  }

  if (exp instanceof Exp.Obj) {
    let { scope } = exp
    let value_map: Map<string, Value.Value> = new Map()
    for (let [name, entry] of scope.named_entries) {

    }
    // case Obj(value_map: ListMap[String, Exp]) =>
    //   ValueObj(value_map.map {
    //     case (name, exp) => (name, evaluate(env, exp))
    //   })
    return new Value.Obj(value_map)
  }

  if (exp instanceof Exp.Dot) {
    let { target, field } = exp
    return evaluate_dot(env, target, field)
  }

  if (exp instanceof Exp.Block) {
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
  }

  throw new Error(
    "evaluate fail\n" +
      `unhandled class of Exp: ${exp.constructor.name}\n`)

}

export function evaluate_ap(env: Env.Env, target: Exp.Exp, args: Array<Exp.Exp>): Value.Value {
  throw new Error("TODO")
}

export function evaluate_dot(env: Env.Env, target: Exp.Exp, field: string): Value.Value {
  throw new Error("TODO")
}
