import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"

import * as Env from "../env"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const result = Env.lookup(env, exp.name)
        if (result === undefined) {
          throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
        }
        return result
      }
      case "Exp.pi": {
        return Value.pi(
          Exp.evaluate(env, exp.arg_t),
          Value.Closure.create(env, exp.name, exp.ret_t)
        )
      }
      case "Exp.fn": {
        return Value.fn(Value.Closure.create(env, exp.name, exp.ret))
      }
      case "Exp.ap": {
        return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg))
      }
      case "Exp.sigma": {
        return Value.sigma(
          Exp.evaluate(env, exp.car_t),
          Value.Closure.create(env, exp.name, exp.cdr_t)
        )
      }
      case "Exp.cons": {
        return Value.cons(
          Exp.evaluate(env, exp.car),
          Exp.evaluate(env, exp.cdr)
        )
      }
      case "Exp.car": {
        return Exp.do_car(evaluate(env, exp.target))
      }
      case "Exp.cdr": {
        return Exp.do_cdr(evaluate(env, exp.target))
      }
      case "Exp.nat": {
        return Value.nat
      }
      case "Exp.zero": {
        return Value.zero
      }
      case "Exp.add1": {
        return Value.add1(Exp.evaluate(env, exp.prev))
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
        return Value.equal(
          Exp.evaluate(env, exp.t),
          Exp.evaluate(env, exp.from),
          Exp.evaluate(env, exp.to)
        )
      }
      case "Exp.same": {
        return Value.same
      }
      case "Exp.replace": {
        return Exp.do_replace(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive),
          Exp.evaluate(env, exp.base)
        )
      }
      case "Exp.trivial": {
        return Value.trivial
      }
      case "Exp.sole": {
        return Value.sole
      }
      case "Exp.absurd": {
        return Value.absurd
      }
      case "Exp.absurd_ind": {
        return Exp.do_absurd_ind(
          Exp.evaluate(env, exp.target),
          Exp.evaluate(env, exp.motive)
        )
      }
      case "Exp.str": {
        return Value.str
      }
      case "Exp.quote": {
        return Value.quote(exp.str)
      }
      case "Exp.type": {
        return Value.type
      }
      case "Exp.begin": {
        env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(env, stmt)
        }
        return evaluate(env, exp.ret)
      }
      case "Exp.the": {
        return Exp.evaluate(env, exp.exp)
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
