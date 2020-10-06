import * as Exp from "../exp"
import * as Stmt from "../stmt"
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
      const pi = Value.is_pi(ctx, t)
      const arg = Value.not_yet(pi.arg_t, Neutral.v(exp.name))
      const ret_t = Closure.apply(pi.ret_t_cl, arg)
      Exp.check(Ctx.extend(ctx, exp.name, pi.arg_t), exp.ret, ret_t)
    } else if (exp.kind === "Exp.cons") {
      const sigma = Value.is_sigma(ctx, t)
      const car = Exp.evaluate(Ctx.to_env(ctx), exp.car)
      const cdr_t = Closure.apply(sigma.cdr_t_cl, car)
      Exp.check(ctx, exp.car, sigma.car_t)
      Exp.check(ctx, exp.cdr, cdr_t)
    } else if (exp.kind === "Exp.same") {
      const equal = Value.is_equal(ctx, t)
      if (!Value.conversion(ctx, equal.t, equal.from, equal.to)) {
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
      const { stmts, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(ctx, stmt)
      }
      Exp.check(ctx, ret, t)
    } else {
      const u = Exp.infer(ctx, exp)
      if (!Value.conversion(ctx, Value.type, t, u)) {
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
