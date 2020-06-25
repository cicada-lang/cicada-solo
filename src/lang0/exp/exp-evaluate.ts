import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as ut from "../../ut"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.Var": {
        const result = Env.lookup(env, exp.name)
        if (result !== undefined) {
          return result
        } else {
          throw new Exp.Trace.Trace(
            exp,
            ut.aline(`
              |I see variable ${exp.name} during evaluate,
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
        return Exp.do_ap(evaluate(env, exp.rator), evaluate(env, exp.rand))
      }
      case "Exp.Suite": {
        for (const def of exp.defs) {
          env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp))
        }
        return evaluate(env, exp.body)
      }
    }
  } catch (error) {
    if (error instanceof Exp.Trace.Trace) {
      const trace = error
      trace.previous.push(exp)
      throw trace
    } else {
      throw error
    }
  }
}
