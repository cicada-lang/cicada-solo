import * as Check from "../check"
import * as Infer from "../infer"
import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Value.Value): void {
  try {
    if (exp.kind === "Exp.fn") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.cons") {
      const sigma = Value.is_sigma(ctx, t)
      const car = Evaluate.evaluate(Ctx.to_env(ctx), exp.car)
      const cdr_t = Value.Closure.apply(sigma.cdr_t_cl, car)
      Check.check(ctx, exp.car, sigma.car_t)
      Check.check(ctx, exp.cdr, cdr_t)
    } else if (exp.kind === "Exp.same") {
      const equal = Value.is_equal(ctx, t)
      if (!Value.conversion(ctx, equal.t, equal.from, equal.to)) {
        throw new Trace.Trace(
          ut.aline(`
          |I am expecting the following two values to be the same ${Readback.readback(
            ctx,
            Value.type,
            equal.t
          ).repr()}.
          |But they are not.
          |from:
          |  ${Readback.readback(ctx, equal.t, equal.from).repr()}
          |to:
          |  ${Readback.readback(ctx, equal.t, equal.to).repr()}
          |`)
        )
      }
    } else if (exp.kind === "Exp.begin") {
      const new_ctx = Ctx.clone(ctx)
      for (const stmt of exp.stmts) {
        Stmt.declare(new_ctx, stmt)
      }
      Check.check(new_ctx, exp.ret, t)
    } else {
      const u = Infer.infer(ctx, exp)
      if (!Value.conversion(ctx, Value.type, t, u)) {
        throw new Trace.Trace(
          ut.aline(`
          |I infer the type of ${exp.repr()} to be ${Readback.readback(
            ctx,
            Value.type,
            u
          ).repr()}.
          |But the given type is ${Readback.readback(
            ctx,
            Value.type,
            t
          ).repr()}.
          |`)
        )
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
