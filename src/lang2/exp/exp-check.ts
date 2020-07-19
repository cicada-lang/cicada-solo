import * as Exp from "../exp"
import * as Value from "../value"
import * as Ty from "../ty"
import * as Closure from "../closure"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    if (exp.kind === "Exp.Fn") {
      // ctx, x: arg_t |- body <= ret_t
      // ---------------------------
      // ctx |- (x) => body  <=  (x: arg_t) -> ret_t
      const pi = Value.isPi(ctx, t)
      const ret_t = Closure.apply(pi.closure, {
        kind: "Value.Reflection",
        t: pi.arg_t,
        neutral: { kind: "Neutral.Var", name: exp.name },
      })
      ctx = Ctx.clone(ctx)
      ctx = Ctx.extend(ctx, exp.name, pi.arg_t)
      Exp.check(ctx, exp.body, ret_t)
    } else if (exp.kind === "Exp.Cons") {
      // ctx |- car <= car_t
      // ctx |- cdr <= cdr_t[car/x]
      // -------------------------
      // ctx |- Cons(car, cdr) <= (x: car_t) * cdr_t
      const sigma = Value.isSigma(ctx, t)
      const car = Exp.evaluate(Ctx.to_env(ctx), exp.car)
      const cdr_t = Closure.apply(sigma.closure, car)
      Exp.check(ctx, exp.car, sigma.car_t)
      Exp.check(ctx, exp.cdr, cdr_t)
    } else if (exp.kind === "Exp.Same") {
      // ctx |- from == to : t
      // ------------------------
      // ctx |- Same <= Equal(t, from, to)
      const equal = Value.isEqual(ctx, t)
      Value.convert(ctx, equal.t, equal.from, equal.to)
    } else {
      // ctx |- exp => u
      // ctx |- t == u : Type
      // ----------------------
      // ctx |- exp <= t
      const u = Exp.infer(ctx, exp)
      Value.convert(ctx, { kind: "Value.Type" }, t, u)
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
