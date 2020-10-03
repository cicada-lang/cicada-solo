import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
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
    } else if (exp.kind === "Exp.ap") {
      // ctx |- f => arrow(a, b)
      // ctx |- e <= a
      // ---------------------
      // ctx |- ap(f, e) => b
      const { target, arg } = exp
      const target_t = Exp.infer(ctx, target)
      if (target_t.kind === "Ty.arrow") {
        Exp.check(ctx, arg, target_t.arg_t)
        return target_t.ret_t
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |I am expecting the target_t to be Ty.arrow,
            |but it is ${Ty.repr(target_t)}.
            |`)
        )
      }
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
      const { defs, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const def of defs) {
        Ctx.update(ctx, def.name, Exp.infer(ctx, def.exp))
      }
      return Exp.infer(ctx, ret)
    } else if (exp.kind === "Exp.rec") {
      // ctx |- n => nat
      // ctx |- b <= t
      // ctx |- s <= arrow(nat, arrow(t, t))
      // ------------------------------
      // ctx |- rec(t, n, b, s) => t
      const { t, target, base, step } = exp
      const target_t = Exp.infer(ctx, target)
      if (target_t.kind === "Ty.nat") {
        Exp.check(ctx, base, t)
        Exp.check(ctx, step, Ty.arrow(Ty.nat, Ty.arrow(t, t)))
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |I am expecting target_t to be Ty.nat,
            |but it is ${Ty.repr(target_t)}.
            |`)
        )
      }
      return t
    } else if (exp.kind === "Exp.the") {
      // ctx |- e <= t
      // ---------------------
      // ctx |- the(t, e) => t
      const the = exp
      Exp.check(ctx, the.exp, the.t)
      return the.t
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
