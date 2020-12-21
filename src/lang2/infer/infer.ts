import * as Infer from "../infer"
import * as Explain from "../explain"
import * as Evaluate from "../evaluate"
import * as Check from "../check"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { do_car } from "../exps/car"
import { do_ap } from "../exps/ap"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.kind === "Exp.v") {
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Explain.explain_name_undefined(exp.name))
      }
      return t
    } else if (exp.kind === "Exp.pi") {
      Check.check(ctx, exp.arg_t, Value.type)
      const arg_t = Evaluate.evaluate(Ctx.to_env(ctx), exp.arg_t)
      ctx = Ctx.extend(ctx, exp.name, arg_t)
      Check.check(ctx, exp.ret_t, Value.type)
      return Value.type
    } else if (exp.kind === "Exp.sigma") {
      Check.check(ctx, exp.car_t, Value.type)
      const car_t = Evaluate.evaluate(Ctx.to_env(ctx), exp.car_t)
      ctx = Ctx.extend(ctx, exp.name, car_t)
      Check.check(ctx, exp.cdr_t, Value.type)
      return Value.type
    } else if (exp.kind === "Exp.ap") {
      const target_t = Infer.infer(ctx, exp.target)
      const pi = Value.is_pi(ctx, target_t)
      Check.check(ctx, exp.arg, pi.arg_t)
      const arg = Evaluate.evaluate(Ctx.to_env(ctx), exp.arg)
      return Value.Closure.apply(pi.ret_t_cl, arg)
    } else if (exp.kind === "Exp.car") {
      const target_t = Infer.infer(ctx, exp.target)
      const sigma = Value.is_sigma(ctx, target_t)
      return sigma.car_t
    } else if (exp.kind === "Exp.cdr") {
      const target_t = Infer.infer(ctx, exp.target)
      const sigma = Value.is_sigma(ctx, target_t)
      const target = Evaluate.evaluate(Ctx.to_env(ctx), exp.target)
      const car = do_car(target)
      return Value.Closure.apply(sigma.cdr_t_cl, car)
    } else if (exp.kind === "Exp.nat") {
      return Value.type
    } else if (exp.kind === "Exp.zero") {
      return Value.nat
    } else if (exp.kind === "Exp.add1") {
      Check.check(ctx, exp.prev, Value.nat)
      return Value.nat
    } else if (exp.kind === "Exp.nat_ind") {
      // NOTE We should always infer target,
      //   but we do a simple check for the simple nat.
      Check.check(ctx, exp.target, Value.nat)
      const motive_t = Evaluate.evaluate(
        Env.init(),
        Exp.pi("x", Exp.nat, Exp.type)
      )
      Check.check(ctx, exp.motive, motive_t)
      const motive = Evaluate.evaluate(Ctx.to_env(ctx), exp.motive)
      Check.check(ctx, exp.base, do_ap(motive, Value.zero))
      Check.check(ctx, exp.step, Exp.nat_ind_step_t(motive))
      const target = Evaluate.evaluate(Ctx.to_env(ctx), exp.target)
      return do_ap(motive, target)
    } else if (exp.kind === "Exp.equal") {
      Check.check(ctx, exp.t, Value.type)
      const t = Evaluate.evaluate(Ctx.to_env(ctx), exp.t)
      Check.check(ctx, exp.from, t)
      Check.check(ctx, exp.to, t)
      return Value.type
    } else if (exp.kind === "Exp.replace") {
      const target_t = Infer.infer(ctx, exp.target)
      const equal = Value.is_equal(ctx, target_t)
      const motive_t = Evaluate.evaluate(
        Env.update(Env.init(), "t", equal.t),
        Exp.pi("x", Exp.v("t"), Exp.type)
      )
      Check.check(ctx, exp.motive, motive_t)
      const motive = Evaluate.evaluate(Ctx.to_env(ctx), exp.motive)
      Check.check(ctx, exp.base, do_ap(motive, equal.from))
      return do_ap(motive, equal.to)
    } else if (exp.kind === "Exp.trivial") {
      return Value.type
    } else if (exp.kind === "Exp.sole") {
      return Value.trivial
    } else if (exp.kind === "Exp.absurd") {
      return Value.type
    } else if (exp.kind === "Exp.absurd_ind") {
      // NOTE the `motive` here is not a function from target_t to type,
      //   but a element of type.
      // NOTE We should always infer target,
      //   but we do a simple check for the simple absurd.
      Check.check(ctx, exp.target, Value.absurd)
      Check.check(ctx, exp.motive, Value.type)
      const motive = Evaluate.evaluate(Ctx.to_env(ctx), exp.motive)
      return motive
    } else if (exp.kind === "Exp.str") {
      return Value.type
    } else if (exp.kind === "Exp.quote") {
      return Value.str
    } else if (exp.kind === "Exp.type") {
      return Value.type
    } else if (exp.kind === "Exp.begin") {
      const { stmts, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(ctx, stmt)
      }
      return Infer.infer(ctx, ret)
    } else if (exp.kind === "Exp.the") {
      Check.check(ctx, exp.t, Value.type)
      const t = Evaluate.evaluate(Ctx.to_env(ctx), exp.t)
      Check.check(ctx, exp.exp, t)
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
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    } else {
      throw error
    }
  }
}
