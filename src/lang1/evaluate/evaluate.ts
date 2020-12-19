import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Env from "../env"
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
        const env_new = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(env_new, stmt)
        }
        return Evaluate.evaluate(env_new, exp.ret)
      }
      case "Exp.zero": {
        return exp.evaluability({ env })
      }
      case "Exp.add1": {
        return exp.evaluability({ env })
      }
      case "Exp.rec": {
        return Evaluate.do_rec(
          exp.t,
          Evaluate.evaluate(env, exp.target),
          Evaluate.evaluate(env, exp.base),
          Evaluate.evaluate(env, exp.step)
        )
      }
      case "Exp.the": {
        return Evaluate.evaluate(env, exp.exp)
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
