import * as Evaluate from "../evaluate"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const result = Env.lookup(env, exp.name)
        if (result === undefined) {
          console.log({ env, exp })
          throw new Trace.Trace(Evaluate.explain_name_undefined(exp.name))
        }
        return result
      }
      case "Exp.fn": {
        return Value.fn(exp.name, exp.ret, env)
      }
      case "Exp.ap": {
        const { target, arg } = exp
        return Evaluate.do_ap(
          Evaluate.evaluate(env, target),
          Evaluate.evaluate(env, arg)
        )
      }
      case "Exp.begin": {
        const env_new = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(env_new, stmt)
        }
        return Evaluate.evaluate(env_new, exp.ret)
      }
      case "Exp.zero": {
        return Value.zero
      }
      case "Exp.add1": {
        return Value.add1(Evaluate.evaluate(env, exp.prev))
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
    } else {
      throw error
    }
  }
}
