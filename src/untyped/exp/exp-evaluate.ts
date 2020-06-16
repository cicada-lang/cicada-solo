import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  switch (exp.kind) {
    case Exp.Kind.Var: {
      const result = Env.lookup(env, exp.name)
      if (result !== undefined) {
        return result
      } else {
        throw new Error(`unknown name: ${exp.name}`)
      }
    }
    case Exp.Kind.Fn: {
      return {
        ...exp,
        kind: Value.Kind.Fn,
        env,
      }
    }
    case Exp.Kind.Ap: {
      return Exp.elim_ap(evaluate(env, exp.rator), evaluate(env, exp.rand))
    }
  }
}
