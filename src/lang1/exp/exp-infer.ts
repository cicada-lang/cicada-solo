import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
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
    } else if (exp.kind === "Exp.Ap") {
      // ctx |- f => Arrow(a, b)
      // ctx |- e <= a
      // ---------------------
      // ctx |- Ap(f, e) => b
      const { target, arg } = exp
      const target_t = Exp.infer(ctx, target)
      if (target_t.kind === "Ty.Arrow") {
        Exp.check(ctx, arg, target_t.arg_t)
        return target_t.ret_t
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |I am expecting the target_t to be Ty.Arrow,
            |but it is ${Ty.repr(target_t)}.
            |`)
        )
      }
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
        Ctx.extend(ctx, def.name, Exp.infer(ctx, def.exp))
      }
      return Exp.infer(ctx, body)
    } else if (exp.kind === "Exp.Rec") {
      // ctx |- n => Nat
      // ctx |- b <= t
      // ctx |- s <= Arrow(Nat, Arrow(t, t))
      // ------------------------------
      // ctx |- Rec(t, n, b, s) => t
      const { t, target, base, step } = exp
      const target_t = Exp.infer(ctx, target)
      if (target_t.kind === "Ty.Nat") {
        Exp.check(ctx, base, t)
        Exp.check(ctx, step, {
          kind: "Ty.Arrow",
          arg_t: { kind: "Ty.Nat" },
          ret_t: { kind: "Ty.Arrow", arg_t: t, ret_t: t },
        })
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |I am expecting target_t to be Ty.Nat,
            |but it is ${Ty.repr(target_t)}.
            |`)
        )
      }
      return t
    } else if (exp.kind === "Exp.The") {
      // ctx |- e <= t
      // ---------------------
      // ctx |- The(t, e) => t
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
