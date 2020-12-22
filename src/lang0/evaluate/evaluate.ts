import { Exp } from "../exp"
import { Env } from "../env"
import { Value } from "../value"
import * as Trace from "../../trace"

export function evaluate(env: Env, exp: Exp): Value {
  try {
    return exp.evaluability({ env })
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
