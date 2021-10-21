import { Core } from "../core"
import { Value } from "../value"
import { Env } from "../env"
import { ExpTrace } from "../errors"

export function evaluate(env: Env, exp: Core): Value {
  return exp.evaluate(env)

  // TODO Do we need to trace error here?

  // try {
  //   return exp.evaluate(env)
  // } catch (error) {
  //   if (error instanceof Trace) throw error.trail(exp)
  //   throw error
  // }
}
