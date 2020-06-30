import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as Ty from "../ty"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    switch (exp.kind) {
      case "Exp.Fn": {
        // ctx, x: a |- e <= b
        // ------------------------------
        // ctx |- Fn(x, e) <= Arrow(a, b)
        switch (t.kind) {
          case "Ty.Arrow": {
            ctx = Ctx.clone(ctx)
            Ctx.extend(ctx, exp.name, t.arg_t)
            Exp.check(ctx, exp.body, t.ret_t)
            return
          }
          default: {
            throw new Trace.Trace(
              ut.aline(`
                |When checking ${Exp.repr(exp)},
                |I am expecting the type to be Ty.Arrow,
                |but the given type is ${Ty.repr(t)}.
                |`)
            )
          }
        }
      }
      case "Exp.Zero": {
        // ------------------
        // ctx |- Zero <= Nat
        switch (t.kind) {
          case "Ty.Nat": {
            return
          }
          default: {
            throw new Trace.Trace(
              ut.aline(`
                |When checking ${Exp.repr(exp)},
                |I am expecting the type to be Ty.Nat,
                |but the given type is ${Ty.repr(t)}.
                |`)
            )
          }
        }
      }
      case "Exp.Succ": {
        // ctx |- prev <= Nat
        // ------------------------
        // ctx |- Succ(prev) <= Nat
        switch (t.kind) {
          case "Ty.Nat": {
            Exp.check(ctx, exp.prev, t)
            return
          }
          default: {
            throw new Trace.Trace(
              ut.aline(`
                |When checking ${Exp.repr(exp)},
                |I am expecting the type to be Ty.Nat,
                |but the given type is ${Ty.repr(t)}.
                |`)
            )
          }
        }
      }
      case "Exp.Var":
      case "Exp.Ap":
      case "Exp.Rec":
      case "Exp.Suite":
      case "Exp.The": {
        const u = Exp.infer(ctx, exp)
        if (ut.equal(t, u)) {
          return
        } else {
          throw new Trace.Trace(
            ut.aline(`
              |When checking ${Exp.repr(exp)},
              |I infer the type to be ${Ty.repr(u)},
              |but the given type is ${Ty.repr(t)}.
              |`)
          )
        }
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
