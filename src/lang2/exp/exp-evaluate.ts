import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
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
              |I see variable ${exp.name} during evaluate,
              |but I can not find it in the environment.
              |`)
          )
        }
      }
      case "Exp.Pi": {
        return {
          kind: "Value.Pi",
          arg_t: Exp.evaluate(env, exp.arg_t),
          closure: new Closure.Closure(env, exp.name, exp.ret_t),
        }
      }
      case "Exp.Fn": {
        return {
          kind: "Value.Fn",
          closure: new Closure.Closure(env, exp.name, exp.body),
        }
      }
      case "Exp.Ap": {
        const { rator, rand } = exp
        return Exp.do_ap(evaluate(env, rator), evaluate(env, rand))
      }
      case "Exp.Sigma":
      case "Exp.Cons":
      case "Exp.Car":
      case "Exp.Cdr":
      case "Exp.Nat":
      case "Exp.Zero":
      case "Exp.Succ":
      case "Exp.NatInd":
      case "Exp.Equal":
      case "Exp.Same":
      case "Exp.Replace":
      case "Exp.Trivial":
      case "Exp.Sole":
      case "Exp.Absurd":
      case "Exp.AbsurdInd":
      case "Exp.Str":
      case "Exp.Quote":
      case "Exp.Type":
      case "Exp.Suite":
      case "Exp.The": {
        throw new Error("TODO")
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
