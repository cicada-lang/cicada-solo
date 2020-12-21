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
      case "Exp.pi": {
        return exp.evaluability({ env })
      }
      case "Exp.fn": {
        return exp.evaluability({ env })
      }
      case "Exp.ap": {
        return exp.evaluability({ env })
      }
      case "Exp.sigma": {
        return exp.evaluability({ env })
      }
      case "Exp.cons": {
        return exp.evaluability({ env })
      }
      case "Exp.car": {
        return exp.evaluability({ env })
      }
      case "Exp.cdr": {
        return exp.evaluability({ env })
      }
      case "Exp.nat": {
        return exp.evaluability({ env })
      }
      case "Exp.zero": {
        return exp.evaluability({ env })
      }
      case "Exp.add1": {
        return exp.evaluability({ env })
      }
      case "Exp.nat_ind": {
        return exp.evaluability({ env })
      }
      case "Exp.equal": {
        return exp.evaluability({ env })
      }
      case "Exp.same": {
        return exp.evaluability({ env })
      }
      case "Exp.replace": {
        return exp.evaluability({ env })
      }
      case "Exp.trivial": {
        return exp.evaluability({ env })
      }
      case "Exp.sole": {
        return exp.evaluability({ env })
      }
      case "Exp.absurd": {
        return exp.evaluability({ env })
      }
      case "Exp.absurd_ind": {
        return exp.evaluability({ env })
      }
      case "Exp.str": {
        return exp.evaluability({ env })
      }
      case "Exp.quote": {
        return exp.evaluability({ env })
      }
      case "Exp.type": {
        return Value.type
      }
      case "Exp.begin": {
        const new_env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(new_env, stmt)
        }
        return Evaluate.evaluate(new_env, exp.ret)
      }
      case "Exp.the": {
        return Evaluate.evaluate(env, exp.exp)
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
