import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
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
          evaluate(env, exp.arg_t),
          new Closure.Closure(env, exp.name, exp.ret_t)
        )
      }
      case "Exp.fn": {
        return Value.fn(new Closure.Closure(env, exp.name, exp.ret))
      }
      case "Exp.ap": {
        return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg))
      }
      case "Exp.cls": {
        const { scope } = exp
        if (scope.length === 0) {
          const queue = new Array()
          const next = undefined
          const tel = Telescope.create(env, new Array(), next, queue)
          return Value.cls(tel)
        } else {
          const queue = new Array()
          for (const { name, t } of scope) {
            queue.push({ name, t })
          }
          const { name, exp } = queue.pop()
          const t = evaluate(env, exp)
          const next = { name, t }
          const tel = Telescope.create(env, new Array(), next, queue)
          return Value.cls(tel)
        }
      }
      case "Exp.fill": {
        const { target, arg } = exp
        return Exp.do_fill(evaluate(env, target), evaluate(env, arg))
      }
      case "Exp.obj": {
        const { properties } = exp
        return Value.obj(
          new Map(
            Array.from(properties, ([name, exp]) => [name, evaluate(env, exp)])
          )
        )
      }
      case "Exp.dot": {
        return Exp.do_dot(evaluate(env, exp.target), exp.name)
      }
      case "Exp.equal": {
        return Value.equal(
          evaluate(env, exp.t),
          evaluate(env, exp.from),
          evaluate(env, exp.to)
        )
      }
      case "Exp.same": {
        return Value.same
      }
      case "Exp.replace": {
        return Exp.do_replace(
          evaluate(env, exp.target),
          evaluate(env, exp.motive),
          evaluate(env, exp.base)
        )
      }
      case "Exp.absurd": {
        return Value.absurd
      }
      case "Exp.absurd_ind": {
        return Exp.do_absurd_ind(
          evaluate(env, exp.target),
          evaluate(env, exp.motive)
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
      case "Exp.suite": {
        env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(env, stmt)
        }
        return evaluate(env, exp.ret)
      }
      case "Exp.the": {
        return evaluate(env, exp.exp)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
