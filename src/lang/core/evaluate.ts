import { Core } from "../core"
import { Env } from "../env"
import { Value } from "../value"

export function evaluate(env: Env, exp: Core): Value {
  // TODO We also need to trace error here.
  // - use `EvaluationError`.
  return exp.evaluate(env)
}
