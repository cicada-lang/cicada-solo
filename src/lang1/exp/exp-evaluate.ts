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
          console.log({env, exp})
          throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
        }
        return result
      }
      case "Exp.fn": {
        return Value.fn(exp.name, exp.ret, env)
      }
      case "Exp.ap": {
        const { target, arg } = exp
        return Exp.do_ap(evaluate(env, target), evaluate(env, arg))
      }
      case "Exp.suite": {
        env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(env, stmt)
        }
        return evaluate(env, exp.ret)
      }
      case "Exp.zero": {
        return Value.zero
      }
      case "Exp.add1": {
        return Value.add1(evaluate(env, exp.prev))
      }
      case "Exp.rec": {
        return Exp.do_rec(
          exp.t,
          evaluate(env, exp.target),
          evaluate(env, exp.base),
          evaluate(env, exp.step)
        )
      }
      case "Exp.the": {
        return evaluate(env, exp.exp)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
