import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export function evaluate(
  mod: Mod.Mod,
  env: Env.Env,
  exp: Exp.Exp,
  opts: {
    shadow_mod_value_p?: boolean
  } = {
    shadow_mod_value_p: false,
  }
): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const value = Env.lookup(env, exp.name)
        if (value !== undefined) return value
        const mod_value = Mod.lookup(mod, exp.name)
        if (mod_value !== undefined) {
          // if (opts.shadow_mod_value_p) {
          //   TODO
          // }
          return mod_value
        }
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      }
      case "Exp.pi": {
        return Value.pi(
          Exp.evaluate(mod, env, exp.arg_t),
          Closure.create(mod, env, exp.name, exp.ret_t)
        )
      }
      case "Exp.fn": {
        return Value.fn(Closure.create(mod, env, exp.name, exp.ret))
      }
      case "Exp.ap": {
        return Exp.do_ap(
          Exp.evaluate(mod, env, exp.target),
          Exp.evaluate(mod, env, exp.arg)
        )
      }
      case "Exp.cls": {
        env = Env.clone(env)
        const sat = new Array()
        for (const entry of exp.sat) {
          const name = entry.name
          const t = Exp.evaluate(mod, env, entry.t)
          const value = Exp.evaluate(mod, env, entry.exp)
          sat.push({ name, t, value })
          Env.update(env, name, value)
        }
        if (exp.scope.length === 0) {
          return Value.cls(
            sat,
            Telescope.create(mod, env, undefined, new Array())
          )
        } else {
          const [entry, ...tail] = exp.scope
          const name = entry.name
          const t = Exp.evaluate(mod, env, entry.t)
          return Value.cls(sat, Telescope.create(mod, env, { name, t }, tail))
        }
      }
      case "Exp.fill": {
        const { target, arg } = exp
        return Exp.do_fill(
          Exp.evaluate(mod, env, target),
          Exp.evaluate(mod, env, arg)
        )
      }
      case "Exp.obj": {
        const { properties } = exp
        return Value.obj(
          new Map(
            Array.from(properties, ([name, exp]) => [
              name,
              Exp.evaluate(mod, env, exp),
            ])
          )
        )
      }
      case "Exp.dot": {
        return Exp.do_dot(Exp.evaluate(mod, env, exp.target), exp.name)
      }
      case "Exp.equal": {
        return Value.equal(
          Exp.evaluate(mod, env, exp.t),
          Exp.evaluate(mod, env, exp.from),
          Exp.evaluate(mod, env, exp.to)
        )
      }
      case "Exp.same": {
        return Value.same
      }
      case "Exp.replace": {
        return Exp.do_replace(
          Exp.evaluate(mod, env, exp.target),
          Exp.evaluate(mod, env, exp.motive),
          Exp.evaluate(mod, env, exp.base)
        )
      }
      case "Exp.absurd": {
        return Value.absurd
      }
      case "Exp.absurd_ind": {
        return Exp.do_absurd_ind(
          Exp.evaluate(mod, env, exp.target),
          Exp.evaluate(mod, env, exp.motive)
        )
      }
      case "Exp.str": {
        return Value.str
      }
      case "Exp.quote": {
        return Value.quote(exp.str)
      }
      case "Exp.union": {
        const { left, right } = exp
        return Value.union(
          Exp.evaluate(mod, env, left),
          Exp.evaluate(mod, env, right)
        )
      }
      case "Exp.type": {
        return Value.type
      }
      case "Exp.begin": {
        env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(mod, env, stmt)
        }
        return Exp.evaluate(mod, env, exp.ret)
      }
      case "Exp.the": {
        return Exp.evaluate(mod, env, exp.exp)
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
