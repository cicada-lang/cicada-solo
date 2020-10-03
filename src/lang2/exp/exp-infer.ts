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
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
      } else {
        return t
      }
    } else if (exp.kind === "Exp.pi") {
      Exp.check(ctx, exp.arg_t, Value.type)
      const arg_t = Exp.evaluate(Ctx.to_env(ctx), exp.arg_t)
      ctx = Ctx.update(Ctx.clone(ctx), exp.name, arg_t)
      Exp.check(ctx, exp.ret_t, Value.type)
      return Value.type
    } else if (exp.kind === "Exp.sigma") {
      Exp.check(ctx, exp.car_t, Value.type)
      const car_t = Exp.evaluate(Ctx.to_env(ctx), exp.car_t)
      ctx = Ctx.update(Ctx.clone(ctx), exp.name, car_t)
      Exp.check(ctx, exp.cdr_t, Value.type)
      return Value.type
    } else if (exp.kind === "Exp.ap") {
      const target_t = Exp.infer(ctx, exp.target)
      const pi = Value.is_pi(ctx, target_t)
      Exp.check(ctx, exp.arg, pi.arg_t)
      const arg = Exp.evaluate(Ctx.to_env(ctx), exp.arg)
      return Closure.apply(pi.ret_t_cl, arg)
    } else if (exp.kind === "Exp.car") {
      const target_t = Exp.infer(ctx, exp.target)
      const sigma = Value.is_sigma(ctx, target_t)
      return sigma.car_t
    } else if (exp.kind === "Exp.cdr") {
      const target_t = Exp.infer(ctx, exp.target)
      const sigma = Value.is_sigma(ctx, target_t)
      const target = Exp.evaluate(Ctx.to_env(ctx), exp.target)
      const car = Exp.do_car(target)
      return Closure.apply(sigma.cdr_t_cl, car)
    } else if (exp.kind === "Exp.nat") {
      return Value.type
    } else if (exp.kind === "Exp.zero") {
      return Value.nat
    } else if (exp.kind === "Exp.add1") {
      Exp.check(ctx, exp.prev, Value.nat)
      return Value.nat
    } else if (exp.kind === "Exp.nat_ind") {
      const target_t = Exp.infer(ctx, exp.target)
      Value.is_nat(ctx, target_t)
      const motive_t = Exp.evaluate(Env.init(), Exp.pi("x", Exp.nat, Exp.type))
      Exp.check(ctx, exp.motive, motive_t)
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      Exp.check(ctx, exp.base, Exp.do_ap(motive, Value.zero))
      Exp.check(ctx, exp.step, Exp.nat_ind_step_t(motive))
      const target = Exp.evaluate(Ctx.to_env(ctx), exp.target)
      return Exp.do_ap(motive, target)
    } else if (exp.kind === "Exp.equal") {
      Exp.check(ctx, exp.t, Value.type)
      const t = Exp.evaluate(Ctx.to_env(ctx), exp.t)
      Exp.check(ctx, exp.from, t)
      Exp.check(ctx, exp.to, t)
      return Value.type
    } else if (exp.kind === "Exp.replace") {
      // ctx |- target => equal(t, from, to)
      // ctx |- motive <= (x: t) -> type
      // ctx |- base <= motive(from)
      // ----------------------
      // ctx |- replace(target, motive, base) => motive(to)
      const target_t = Exp.infer(ctx, exp.target)
      const equal = Value.is_equal(ctx, target_t)
      const motive_t = Exp.evaluate(
        Env.update(Env.init(), "t", equal.t),
        Exp.pi("x", Exp.v("t"), Exp.type)
      )
      Exp.check(ctx, exp.motive, motive_t)
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      Exp.check(ctx, exp.base, Exp.do_ap(motive, equal.from))
      return Exp.do_ap(motive, equal.to)
    } else if (exp.kind === "Exp.trivial") {
      return Value.type
    } else if (exp.kind === "Exp.sole") {
      return Value.trivial
    } else if (exp.kind === "Exp.absurd") {
      return Value.type
    } else if (exp.kind === "Exp.absurd_ind") {
      // NOTE the `motive` here is not a function from target_t to type,
      //   but a element of type.
      // ctx |- target => absurd
      // ctx |- motive <= type
      // ----------------------------
      // ctx |- absurd.ind(target, motive): motive
      const target_t = Exp.infer(ctx, exp.target)
      const absurd = Value.is_absurd(ctx, target_t)
      Exp.check(ctx, exp.motive, Value.type)
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      return motive
    } else if (exp.kind === "Exp.str") {
      return Value.type
    } else if (exp.kind === "Exp.quote") {
      return Value.str
    } else if (exp.kind === "Exp.type") {
      return Value.type
    } else if (exp.kind === "Exp.suite") {
      const { defs, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const def of defs) {
        const t = Exp.infer(ctx, def.exp)
        const value = Exp.evaluate(Ctx.to_env(ctx), def.exp)
        Ctx.define(ctx, def.name, t, value)
      }
      return Exp.infer(ctx, ret)
    } else if (exp.kind === "Exp.the") {
      Exp.check(ctx, exp.t, Value.type)
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
