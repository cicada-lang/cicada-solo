import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Value from "../value"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        return exp.evaluability({ env })
      }
      case "Exp.fn": {
        return exp.evaluability({ env })
      }
      case "Exp.ap": {
        return exp.evaluability({ env })
      }
      case "Exp.begin": {
        return exp.evaluability({ env })
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
