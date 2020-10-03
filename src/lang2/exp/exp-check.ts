import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Ty from "../ty"
import * as Closure from "../closure"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    if (exp.kind === "Exp.fn") {
      // ctx, x: arg_t |- ret <= ret_t
      // ---------------------------
      // ctx |- (x) => ret  <=  (x: arg_t) -> ret_t
      const pi = Value.is_pi(ctx, t)
      const arg = Value.reflection(pi.arg_t, Neutral.v(exp.name))
      const ret_t = Closure.apply(pi.closure, arg)
      ctx = Ctx.clone(ctx)
      ctx = Ctx.update(ctx, exp.name, pi.arg_t)
      Exp.check(ctx, exp.ret, ret_t)
    } else if (exp.kind === "Exp.cons") {
      // ctx |- car <= car_t
      // ctx |- cdr <= cdr_t[car/x]
      // -------------------------
      // ctx |- cons(car, cdr) <= (x: car_t) * cdr_t
      const sigma = Value.is_sigma(ctx, t)
      const car = Exp.evaluate(Ctx.to_env(ctx), exp.car)
      const cdr_t = Closure.apply(sigma.closure, car)
      Exp.check(ctx, exp.car, sigma.car_t)
      Exp.check(ctx, exp.cdr, cdr_t)
    } else if (exp.kind === "Exp.same") {
      // ctx |- from == to : t
      // ------------------------
      // ctx |- same <= equal(t, from, to)
      const equal = Value.is_equal(ctx, t)
      if (!Value.convert(ctx, equal.t, equal.from, equal.to)) {
        throw new Trace.Trace(
          ut.aline(`
          |I am expecting the following two values to be the same ${Exp.repr(
            Value.readback(ctx, Value.type, equal.t)
          )}.
          |But they are not.
          |from:
          |  ${Exp.repr(Value.readback(ctx, equal.t, equal.from))}
          |to:
          |  ${Exp.repr(Value.readback(ctx, equal.t, equal.to))}
          |`)
        )
      }
    } else if (exp.kind === "Exp.suite") {
      const { defs, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const def of defs) {
        const t = Exp.infer(ctx, def.exp)
        const value = Exp.evaluate(Ctx.to_env(ctx), def.exp)
        Ctx.define(ctx, def.name, t, value)
      }
      Exp.check(ctx, ret, t)
    } else {
      // ctx |- exp => u
      // ctx |- t == u : type
      // ----------------------
      // ctx |- exp <= t
      const u = Exp.infer(ctx, exp)
      if (!Value.convert(ctx, Value.type, t, u)) {
        throw new Trace.Trace(
          ut.aline(`
          |I infer the type of ${Exp.repr(exp)} to be ${Exp.repr(
            Value.readback(ctx, Value.type, u)
          )}.
          |But the given type is ${Exp.repr(
            Value.readback(ctx, Value.type, t)
          )}.
          |`)
        )
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
