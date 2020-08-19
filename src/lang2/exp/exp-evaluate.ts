import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Env from "../env"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const result = Env.lookup(env, exp.name)
        if (result !== undefined) {
          return result
        } else {
          throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
        }
      }
      case "Exp.pi": {
        return {
          kind: "Value.pi",
          arg_t: Exp.evaluate(env, exp.arg_t),
          closure: new Closure.Closure(env, exp.name, exp.ret_t),
        }
      }
      case "Exp.fn": {
        return {
          kind: "Value.fn",
          closure: new Closure.Closure(env, exp.name, exp.body),
        }
      }
      case "Exp.ap": {
        return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg))
      }
      case "Exp.sigma": {
        return {
          kind: "Value.sigma",
          car_t: Exp.evaluate(env, exp.car_t),
          closure: new Closure.Closure(env, exp.name, exp.cdr_t),
        }
      }
      case "Exp.cons": {
        return {
          kind: "Value.cons",
          car: Exp.evaluate(env, exp.car),
          cdr: Exp.evaluate(env, exp.cdr),
        }
      }
      case "Exp.car": {
        return Exp.do_car(evaluate(env, exp.target))
      }
      case "Exp.cdr": {
        return Exp.do_cdr(evaluate(env, exp.target))
      }
      case "Exp.nat": {
        return {
          kind: "Value.nat",
        }
      }
      case "Exp.zero": {
        return {
          kind: "Value.zero",
        }
      }
      case "Exp.add1": {
        return {
          kind: "Value.add1",
          prev: Exp.evaluate(env, exp.prev),
        }
      }
      case "Exp.nat_ind": {
        return Exp.do_nat_ind(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive),
          Exp.evaluate(env, exp.base),
          Exp.evaluate(env, exp.step)
        )
      }
      case "Exp.equal": {
        return {
          kind: "Value.equal",
          t: Exp.evaluate(env, exp.t),
          from: Exp.evaluate(env, exp.from),
          to: Exp.evaluate(env, exp.to),
        }
      }
      case "Exp.same": {
        return {
          kind: "Value.same",
        }
      }
      case "Exp.replace": {
        return Exp.do_replace(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive),
          Exp.evaluate(env, exp.base)
        )
      }
      case "Exp.trivial": {
        return {
          kind: "Value.trivial",
        }
      }
      case "Exp.sole": {
        return {
          kind: "Value.sole",
        }
      }
      case "Exp.absurd": {
        return {
          kind: "Value.absurd",
        }
      }
      case "Exp.absurd_ind": {
        return Exp.do_absurd_ind(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive)
        )
      }
      case "Exp.str": {
        return {
          kind: "Value.str",
        }
      }
      case "Exp.quote": {
        return {
          kind: "Value.quote",
          str: exp.str,
        }
      }
      case "Exp.type": {
        return {
          kind: "Value.type",
        }
      }
      case "Exp.suite": {
        for (const def of exp.defs) {
          env = Env.extend(Env.clone(env), def.name, evaluate(env, def.exp))
        }
        return evaluate(env, exp.body)
      }
      case "Exp.the": {
        return Exp.evaluate(env, exp.exp)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
