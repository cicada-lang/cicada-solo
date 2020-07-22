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
      const target_t = Exp.infer(ctx, exp.target)
      const sigma = Value.isSigma(ctx, target_t)
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
    } else if (exp.kind === "Exp.Zero") {
      return { kind: "Value.Nat" }
    } else if (exp.kind === "Exp.Add1") {
      Exp.check(ctx, exp.prev, { kind: "Value.Nat" })
      return { kind: "Value.Nat" }
    } else if (exp.kind === "Exp.NatInd") {
      // ctx |- target => Nat
      // ctx |- motive <= (x: Nat) -> Type
      // ctx |- base <= motive(Zero)
      // ctx |- step <= (prev: Nat) -> (almost: motive(prev)) -> motive(Add1(prev))
      // ----------------------
      // ctx |- Nat.ind(target, motive, base, step) => motive(target)
      const target_t = Exp.infer(ctx, exp.target)
      Value.isNat(ctx, target_t)
      const motive_t = Exp.evaluate(Env.init(), {
        kind: "Exp.Pi",
        name: "x",
        arg_t: { kind: "Exp.Nat" },
        ret_t: { kind: "Exp.Type" },
      })
      Exp.check(ctx, exp.motive, motive_t)
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      Exp.check(ctx, exp.base, Exp.do_ap(motive, { kind: "Value.Zero" }))
      Exp.check(ctx, exp.step, Exp.nat_ind_step_t(motive))
      const target = Exp.evaluate(Ctx.to_env(ctx), exp.target)
      return Exp.do_ap(motive, target)
    } else if (exp.kind === "Exp.Equal") {
      // ctx |- t <= Type
      // ctx |- from <= t
      // ctx |- to <= t
      // ---------------------
      // ctx |- Equal(t, from, to) => Type
      Exp.check(ctx, exp.t, { kind: "Value.Type" })
      const t = Exp.evaluate(Ctx.to_env(ctx), exp.t)
      Exp.check(ctx, exp.from, t)
      Exp.check(ctx, exp.to, t)
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Replace") {
      // ctx |- target => Equal(t, from, to)
      // ctx |- motive <= (x: t) -> Type
      // ctx |- base <= motive(from)
      // ----------------------
      // ctx |- replace(target, motive, base) => motive(to)
      const target_t = Exp.infer(ctx, exp.target)
      const equal = Value.isEqual(ctx, target_t)
      const motive_t = Exp.evaluate(Env.extend(Env.init(), "t", equal.t), {
        kind: "Exp.Pi",
        name: "x",
        arg_t: { kind: "Exp.Var", name: "t" },
        ret_t: { kind: "Exp.Type" },
      })
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      Exp.check(ctx, exp.motive, motive_t)
      Exp.check(ctx, exp.base, Exp.do_ap(motive, equal.from))
      return Exp.do_ap(motive, equal.to)
    } else if (exp.kind === "Exp.Trivial") {
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Sole") {
      return { kind: "Value.Trivial" }
    } else if (exp.kind === "Exp.Absurd") {
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.AbsurdInd") {
      // NOTE the `motive` here is not a function from target_t to Type,
      //   but a element of Type.
      // ctx |- target => Absurd
      // ctx |- motive <= Type
      // ----------------------------
      // ctx |- Absurd.ind(target, motive): motive
      const target_t = Exp.infer(ctx, exp.target)
      const absurd = Value.isAbsurd(ctx, target_t)
      Exp.check(ctx, exp.motive, { kind: "Value.Type" })
      const motive = Exp.evaluate(Ctx.to_env(ctx), exp.motive)
      return motive
    } else if (exp.kind === "Exp.Str") {
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Quote") {
      return { kind: "Value.Str" }
    } else if (exp.kind === "Exp.Type") {
      return { kind: "Value.Type" }
    } else if (exp.kind === "Exp.Suite") {
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
    } else if (exp.kind === "Exp.The") {
      // ctx |- t <= Type
      // ctx |- exp <= t
      // -----------------------------
      // ctx |- The(t, exp) => t
      Exp.check(ctx, exp.t, { kind: "Value.Type" })
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
