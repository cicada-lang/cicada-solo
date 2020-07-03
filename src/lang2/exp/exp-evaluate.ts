import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Env from "../env"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.Var": {
        const result = Env.lookup(env, exp.name)
        if (result !== undefined) {
          return result
        } else {
          throw new Trace.Trace(
            Exp.explain_name_undefined(exp.name)
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
        return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg))
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
      case "Exp.Car": {
        return Exp.do_car(evaluate(env, exp.target))
      }
      case "Exp.Cdr": {
        return Exp.do_cdr(evaluate(env, exp.target))
      }
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
      case "Exp.NatInd": {
        return Exp.do_nat_ind(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive),
          Exp.evaluate(env, exp.base),
          Exp.evaluate(env, exp.step)
        )
      }
      case "Exp.Equal": {
        return {
          kind: "Value.Equal",
          t: Exp.evaluate(env, exp.t),
          from: Exp.evaluate(env, exp.from),
          to: Exp.evaluate(env, exp.to),
        }
      }
      case "Exp.Same": {
        return {
          kind: "Value.Same",
        }
      }
      case "Exp.Replace": {
        return Exp.do_replace(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive),
          Exp.evaluate(env, exp.base)
        )
      }
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
      case "Exp.AbsurdInd": {
        return Exp.do_absurd_ind(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive)
        )
      }
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
      case "Exp.Suite": {
        for (const def of exp.defs) {
          env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp))
        }
        return evaluate(env, exp.body)
      }
      case "Exp.The": {
        return Exp.evaluate(env, exp.exp)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
