import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.Var": {
        const result = Env.lookup(env, exp.name)
        if (result !== undefined) {
          return result
        } else {
          throw new Trace.Trace(
            ut.aline(`
              |I see variable ${exp.name},
              |but I can not find it in the environment.
              |`)
          )
        }
      }
      case "Exp.Fn": {
        return {
          ...exp,
          kind: "Value.Fn",
          env,
        }
      }
      case "Exp.Ap": {
        const { target, arg } = exp
        return Exp.do_ap(evaluate(env, target), evaluate(env, arg))
      }
      case "Exp.Suite": {
        for (const def of exp.defs) {
          env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp))
        }
        return evaluate(env, exp.body)
      }
      case "Exp.Zero": {
        return {
          kind: "Value.Zero",
        }
      }
      case "Exp.Succ": {
        return {
          kind: "Value.Succ",
          prev: evaluate(env, exp.prev),
        }
      }
      case "Exp.Rec": {
        return Exp.do_rec(
          exp.t,
          evaluate(env, exp.target),
          evaluate(env, exp.base),
          evaluate(env, exp.step)
        )
      }
      case "Exp.The": {
        return evaluate(env, exp.exp)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
