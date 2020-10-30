import * as Evaluator from "../evaluator"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Value from "../value"
import * as Trace from "../../trace"

export function evaluate(
  evaluator: Evaluator.Evaluator,
  exp: Exp.Exp
): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const result = Env.lookup(evaluator.env, exp.name)
        if (result === undefined) {
          throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
        }
        return result
      }
      case "Exp.fn": {
        return Value.fn(exp.name, exp.ret, evaluator.env)
      }
      case "Exp.ap": {
        return Exp.do_ap(
          Evaluator.evaluate(evaluator, exp.target),
          Evaluator.evaluate(evaluator, exp.arg)
        )
      }
      case "Exp.begin": {
        const env = Env.clone(evaluator.env)
        for (const stmt of exp.stmts) {
          Stmt.execute(env, stmt)
        }
        return Evaluator.evaluate(Evaluator.create(env), exp.ret)
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
