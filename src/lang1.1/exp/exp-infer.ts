import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as Ty from "../ty"
import * as ut from "../../ut"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  try {
    switch (exp.kind) {
      case "Exp.Var": {
        // a = lookup(x, ctx)
        // ---------------------
        // ctx |- x => a
        const t = Ctx.lookup(ctx, exp.name)
        if (t === undefined) {
          throw new Trace.Trace(
            ut.aline(`
              |I see variable ${exp.name} during infer,
              |but I can not find it in the environment.
              |`)
          )
        } else {
          return t
        }
      }
      case "Exp.Ap": {
        // ctx |- f => Arrow(a, b)
        // ctx |- e <= a
        // ---------------------
        // ctx |- Ap(f, e) => b
        const { rator, rand } = exp
        const rator_t = Exp.infer(ctx, rator)
        switch (rator_t.kind) {
          case "Ty.Arrow": {
            Exp.check(ctx, rand, rator_t.arg_t)
            return rator_t.ret_t
          }
          default: {
            throw new Trace.Trace(
              ut.aline(`
                |I am expecting the rator_t to be Ty.Arrow,
                |but it is ${Ty.repr(rator_t)}.
                |`)
            )
          }
        }
      }
      case "Exp.Suite": {
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
      }
      case "Exp.Rec": {
        // ctx |- n => Nat
        // ctx |- b <= t
        // ctx |- s <= Arrow(Nat, Arrow(t, t))
        // ------------------------------
        // ctx |- Rec(t, n, b, s) => t
        const { t, target, base, step } = exp
        const target_t = Exp.infer(ctx, target)
        switch (target_t.kind) {
          case "Ty.Nat": {
            Exp.check(ctx, base, t)
            Exp.check(ctx, step, {
              kind: "Ty.Arrow",
              arg_t: { kind: "Ty.Nat" },
              ret_t: { kind: "Ty.Arrow", arg_t: t, ret_t: t },
            })
          }
          default: {
            throw new Trace.Trace(
              ut.aline(`
              |I am expecting target_t to be Ty.Nat,
              |but it is ${Ty.repr(target_t)}.
              |`)
            )
          }
        }
      }
      case "Exp.The": {
        // ctx |- e <= t
        // ---------------------
        // ctx |- The(t, e) => t
        const the = exp
        Exp.check(ctx, the.exp, the.t)
        return the.t
      }
      case "Exp.Fn":
      case "Exp.Zero":
      case "Exp.Succ": {
        throw new Trace.Trace(
          ut.aline(`
            |I can not infer the type of ${Exp.repr(exp)}.
            |I suggest you add a type annotation to the expression.
            |`)
        )
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      const trace = error
      trace.previous.push(exp)
      throw trace
    } else {
      throw error
    }
  }
}
