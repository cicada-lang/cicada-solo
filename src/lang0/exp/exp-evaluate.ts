import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.Var": {
        const result = Env.lookup(env, exp.name)
        if (result !== undefined) {
          return result
        } else {
          throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
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
        return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg))
      }
      case "Exp.Suite": {
        for (const def of exp.defs) {
          env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp))
        }
        return evaluate(env, exp.body)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
