import { Core } from "../core"
import { Value } from "../value"
import { Env } from "../env"
import { Trace } from "../trace"

export function evaluate(env: Env, exp: Core): Value {
  try {
    return exp.evaluate(env)
  } catch (error) {
    if (error instanceof Trace) throw error.trail(exp)
    throw error
  }
}
