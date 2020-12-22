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
        return Value.fn(exp.name, exp.ret, env)
      }
      case "Exp.ap": {
        return Evaluate.do_ap(
          Evaluate.evaluate(env, exp.target),
          Evaluate.evaluate(env, exp.arg)
        )
      }
      case "Exp.begin": {
        const new_env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(new_env, stmt)
        }
        return Evaluate.evaluate(new_env, exp.ret)
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    } else {
      throw error
    }
  }
}
