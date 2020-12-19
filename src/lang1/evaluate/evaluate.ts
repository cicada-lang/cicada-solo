import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    return exp.evaluability({ env })
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
