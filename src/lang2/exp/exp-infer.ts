import * as Exp from "../exp"
import * as Value from "../value"
import * as Ty from "../ty"
import * as Closure from "../closure"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  try {
    if (exp.kind === "Exp.v") {
      // a = lookup(x, ctx)
      // ---------------------
      // ctx |- x => a
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      } else {
        return t
      }
    } else if (exp.kind === "Exp.pi") {
      // ctx |- arg_t <= type
      // ctx, name: arg_t |- ret_t <= type
      // ------------------------
      // ctx |- pi(name, arg_t, ret_t) => type
      Exp.check(ctx, exp.arg_t, { kind: "Value.type" })
      const arg_t = Exp.evaluate(Ctx.to_env(ctx), exp.arg_t)
      ctx = Ctx.extend(Ctx.clone(ctx), exp.name, arg_t)
      Exp.check(ctx, exp.ret_t, { kind: "Value.type" })
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.ap") {
      // ctx |- target => pi(name, arg_t, ret_t)
      // ctx |- arg <= arg_t
      // ------------------------
      // ctx |- ap(target, arg) => ret_t[arg/name]
      // NOTE the language of inference rule does not use closure,
      //   while we can also use closure:
      // ctx |- target => pi(arg_t, closure)
      // ctx |- arg <= arg_t
      // ------------------------
      // ctx |- ap(target, arg) => closure(arg)
      const target_t = Exp.infer(ctx, exp.target)
      const pi = Value.ispi(ctx, target_t)
      Exp.check(ctx, exp.arg, pi.arg_t)
      const arg = Exp.evaluate(Ctx.to_env(ctx), exp.arg)
      return Closure.apply(pi.closure, arg)
    } else if (exp.kind === "Exp.sigma") {
      // ctx |- car_t <= type
      // ctx, name: car_t |- cdr_t <= type
      // ------------------------
      // ctx |- sigma(name, car, cdr_t) => type
      Exp.check(ctx, exp.car_t, { kind: "Value.type" })
      const car_t = Exp.evaluate(Ctx.to_env(ctx), exp.car_t)
      ctx = Ctx.extend(Ctx.clone(ctx), exp.name, car_t)
      Exp.check(ctx, exp.cdr_t, { kind: "Value.type" })
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.car") {
      // ctx |- target => sigma(name, car_t, cdr_t)
      // ------------------------
      // ctx |- car(target) => car_t
      const target_t = Exp.infer(ctx, exp.target)
      const sigma = Value.issigma(ctx, target_t)
      return sigma.car_t
    } else if (exp.kind === "Exp.cdr") {
      // ctx |- target => sigma(name, car_t, cdr_t)
      // ------------------------
      // ctx |- cdr(target) => cdr_t[car(target)/name]
      // NOTE use closure:
      // ctx |- target => sigma(car_t, closure)
      // ------------------------
      // ctx |- cdr(target) => apply(closure, car(target))
      const target_t = Exp.infer(ctx, exp.target)
      const sigma = Value.issigma(ctx, target_t)
      const target = Exp.evaluate(Ctx.to_env(ctx), exp.target)
      const car = Exp.do_car(target)
      return Closure.apply(sigma.closure, car)
    } else if (exp.kind === "Exp.nat") {
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.zero") {
      return { kind: "Value.nat" }
    } else if (exp.kind === "Exp.add1") {
      Exp.check(ctx, exp.prev, { kind: "Value.nat" })
      return { kind: "Value.nat" }
    } else if (exp.kind === "Exp.nat_ind") {
      // ctx |- target => nat
      // ctx |- motive <= (x: nat) -> type
      // ctx |- base <= motive(zero)
      // ctx |- step <= (prev: nat) -> (almost: motive(prev)) -> motive(add1(prev))
      // ----------------------
      // ctx |- nat.ind(target, motive, base, step) => motive(target)
      const target_t = Exp.infer(ctx, exp.target)
      Value.isnat(ctx, target_t)
      const motive_t = Exp.evaluate(Env.init(), {
        kind: "Exp.pi",
        name: "x",
        arg_t: { kind: "Exp.nat" },
        ret_t: { kind: "Exp.type" },
      })
      Exp.check(ctx, exp.motive, motive_t)
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      Exp.check(ctx, exp.base, Exp.do_ap(motive, { kind: "Value.zero" }))
      Exp.check(ctx, exp.step, Exp.nat_ind_step_t(motive))
      const target = Exp.evaluate(Ctx.to_env(ctx), exp.target)
      return Exp.do_ap(motive, target)
    } else if (exp.kind === "Exp.equal") {
      // ctx |- t <= type
      // ctx |- from <= t
      // ctx |- to <= t
      // ---------------------
      // ctx |- equal(t, from, to) => type
      Exp.check(ctx, exp.t, { kind: "Value.type" })
      const t = Exp.evaluate(Ctx.to_env(ctx), exp.t)
      Exp.check(ctx, exp.from, t)
      Exp.check(ctx, exp.to, t)
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.replace") {
      // ctx |- target => equal(t, from, to)
      // ctx |- motive <= (x: t) -> type
      // ctx |- base <= motive(from)
      // ----------------------
      // ctx |- replace(target, motive, base) => motive(to)
      const target_t = Exp.infer(ctx, exp.target)
      const equal = Value.isequal(ctx, target_t)
      const motive_t = Exp.evaluate(Env.extend(Env.init(), "t", equal.t), {
        kind: "Exp.pi",
        name: "x",
        arg_t: { kind: "Exp.v", name: "t" },
        ret_t: { kind: "Exp.type" },
      })
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      Exp.check(ctx, exp.motive, motive_t)
      Exp.check(ctx, exp.base, Exp.do_ap(motive, equal.from))
      return Exp.do_ap(motive, equal.to)
    } else if (exp.kind === "Exp.trivial") {
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.sole") {
      return { kind: "Value.trivial" }
    } else if (exp.kind === "Exp.absurd") {
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.absurd_ind") {
      // NOTE the `motive` here is not a function from target_t to type,
      //   but a element of type.
      // ctx |- target => absurd
      // ctx |- motive <= type
      // ----------------------------
      // ctx |- absurd.ind(target, motive): motive
      const target_t = Exp.infer(ctx, exp.target)
      const absurd = Value.isabsurd(ctx, target_t)
      Exp.check(ctx, exp.motive, { kind: "Value.type" })
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      return motive
    } else if (exp.kind === "Exp.str") {
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.quote") {
      return { kind: "Value.str" }
    } else if (exp.kind === "Exp.type") {
      return { kind: "Value.type" }
    } else if (exp.kind === "Exp.suite") {
      // ctx |- e1 => t1
      // ctx, x1: t1 |- e2 => t2
      // ctx, x1: t1, x2: t2 |- ...
      // ...
      // ctx, x1: t1, x2: t2, ... |- e => t
      // ---------------------
      // ctx |- { x1 = e1
      //          x2 = e2
      //          ...
      //          e
      //        } => t
      const { defs, body } = exp
      ctx = Ctx.clone(ctx)
      for (const def of defs) {
        const t = Exp.infer(ctx, def.exp)
        const value = Exp.evaluate(Ctx.to_env(ctx), def.exp)
        Ctx.define(ctx, def.name, t, value)
      }
      return Exp.infer(ctx, body)
    } else if (exp.kind === "Exp.the") {
      // ctx |- t <= type
      // ctx |- exp <= t
      // -----------------------------
      // ctx |- the(t, exp) => t
      Exp.check(ctx, exp.t, { kind: "Value.type" })
      const t = Exp.evaluate(Ctx.to_env(ctx), exp.t)
      Exp.check(ctx, exp.exp, t)
      return t
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
