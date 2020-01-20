import * as Exp from "./exp"
import * as Value from "./value"
import { Env } from "./env"
import { check } from "./check"

export function evaluate(env: Env, exp: Exp.Exp): Value.Value {
  if (exp instanceof Exp.Var) {
    let { name } = exp
    return new Value.Neutral.Var(name)
  }
  // TODO
  throw new Error("TODO")
}

export function evaluate_ap(env: Env, target: Exp.Exp, args: Array<Exp.Exp>): Value.Value {
  throw new Error("TODO")
}

export function evaluate_dot(env: Env, target: Exp.Exp, field: string): Value.Value {
  throw new Error("TODO")
}
