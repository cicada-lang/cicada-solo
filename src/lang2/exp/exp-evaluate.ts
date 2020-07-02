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
      case "Exp.Sigma": {
        return {
          kind: "Value.Sigma",
          car_t: Exp.evaluate(env, exp.car_t),
          closure: new Closure.Closure(env, exp.name, exp.cdr_t),
        }
      }
      case "Exp.Cons": {
        return {
          kind: "Value.Cons",
          car: Exp.evaluate(env, exp.car),
          cdr: Exp.evaluate(env, exp.cdr),
        }
      }
      case "Exp.Car":
      case "Exp.Cdr":
      case "Exp.Nat": {
        return {
          kind: "Value.Nat",
        }
      }
      case "Exp.Zero": {
        return {
          kind: "Value.Zero",
        }
      }
      case "Exp.Succ": {
        return {
          kind: "Value.Succ",
          prev: Exp.evaluate(env, exp.prev),
        }
      }
      case "Exp.NatInd":
      case "Exp.Equal":
      case "Exp.Same": {
        return {
          kind: "Value.Same",
        }
      }
      case "Exp.Replace":
      case "Exp.Trivial": {
        return {
          kind: "Value.Trivial",
        }
      }
      case "Exp.Sole": {
        return {
          kind: "Value.Sole",
        }
      }
      case "Exp.Absurd": {
        return {
          kind: "Value.Absurd",
        }
      }
      case "Exp.AbsurdInd":
      case "Exp.Str": {
        return {
          kind: "Value.Str",
        }
      }
      case "Exp.Quote": {
        return {
          kind: "Value.Quote",
          str: exp.str,
        }
      }
      case "Exp.Type": {
        return {
          kind: "Value.Type",
        }
      }
      case "Exp.Suite":
      case "Exp.The": {
        throw new Error("TODO")
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
