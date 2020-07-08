import * as Exp from "../exp"
import * as Value from "../value"
import * as Ty from "../ty"
import * as Closure from "../closure"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { trace } from "console"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  try {
    if (exp.kind === "Exp.Var") {
      // a = lookup(x, ctx)
      // ---------------------
      // ctx |- x => a
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      } else {
        return t
      }
    } else if (exp.kind === "Exp.Pi") {
      // ctx |- arg_t <= Type
      // ctx, name: arg_t |- ret_t <= Type
      // ------------------------
      // ctx |- Pi(name, arg_t, ret_t) => Type
      Exp.check(ctx, exp.arg_t, { kind: "Value.Type" })
      const arg_t = Exp.evaluate(Ctx.to_env(ctx), exp.arg_t)
      ctx = Ctx.extend(Ctx.clone(ctx), exp.name, arg_t)
      Exp.check(ctx, exp.ret_t, { kind: "Value.Type" })
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Ap") {
      // ctx |- target => Pi(name, arg_t, ret_t)
      // ctx |- arg <= arg_t
      // ------------------------
      // ctx |- Ap(target, arg) => ret_t[arg/name]
      // NOTE The language of inference rule does not use closure,
      //   while we can also use closure:
      // ctx |- target => Pi(arg_t, closure)
      // ctx |- arg <= arg_t
      // ------------------------
      // ctx |- Ap(target, arg) => closure(arg)
      const target_t = Exp.infer(ctx, exp.target)
      const pi = Value.isPi(ctx, target_t)
      Exp.check(ctx, exp.arg, pi.arg_t)
      const arg = Exp.evaluate(Ctx.to_env(ctx), exp.arg)
      return Closure.apply(pi.closure, arg)
    } else if (exp.kind === "Exp.Sigma") {
      // ctx |- car_t <= Type
      // ctx, name: car_t |- cdr_t <= Type
      // ------------------------
      // ctx |- Sigma(name, car, cdr_t) => Type
      Exp.check(ctx, exp.car_t, { kind: "Value.Type" })
      const car_t = Exp.evaluate(Ctx.to_env(ctx), exp.car_t)
      ctx = Ctx.extend(Ctx.clone(ctx), exp.name, car_t)
      Exp.check(ctx, exp.cdr_t, { kind: "Value.Type" })
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Car") {
      // ctx |- target => Sigma(name, car_t, cdr_t)
      // ------------------------
      // ctx |- car(target) => car_t
      const sigma = Value.isSigma(ctx, Exp.infer(ctx, exp.target))
      return sigma.car_t
    } else if (exp.kind === "Exp.Cdr") {
      // ctx |- target => Sigma(name, car_t, cdr_t)
      // ------------------------
      // ctx |- cdr(target) => cdr_t[car(target)/name]
      // NOTE use closure:
      // ctx |- target => Sigma(car_t, closure)
      // ------------------------
      // ctx |- cdr(target) => apply(closure, car(target))
      const target_t = Exp.infer(ctx, exp.target)
      const sigma = Value.isSigma(ctx, target_t)
      const target = Exp.evaluate(Ctx.to_env(ctx), exp.target)
      const car = Exp.do_car(target)
      return Closure.apply(sigma.closure, car)
    } else if (exp.kind === "Exp.Nat") {
      return { kind: "Value.Type" }
      // TODO
    } else {
      throw new Trace.Trace(
        ut.aline(`
          |I can not infer the type of ${Exp.repr(exp)}.
          |I suggest you add a type annotation to the expression.
          |`)
      )
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
