import { Core } from "../core"
import { Value } from "../value"
import { Env } from "../env"
import { ExpTrace } from "../errors"

export function evaluate(env: Env, exp: Core): Value {
  return exp.evaluate(env)
  // try {
  //   return exp.evaluate(env)
  // } catch (error) {
  //   if (error instanceof Trace) throw error.trail(exp)
  //   throw error
  // }
}
