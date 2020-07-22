import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    if (exp.kind === "Exp.Fn") {
      // ctx, x: a |- e <= b
      // ------------------------------
      // ctx |- Fn(x, e) <= Arrow(a, b)
      if (t.kind === "Ty.Arrow") {
        ctx = Ctx.clone(ctx)
        Ctx.extend(ctx, exp.name, t.arg_t)
        Exp.check(ctx, exp.body, t.ret_t)
        return
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.Arrow,
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.Zero") {
      // ------------------
      // ctx |- Zero <= Nat
      if (t.kind === "Ty.Nat") {
        return
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.Nat,
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.Add1") {
      // ctx |- prev <= Nat
      // ------------------------
      // ctx |- Add1(prev) <= Nat
      if (t.kind === "Ty.Nat") {
        Exp.check(ctx, exp.prev, t)
        return
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.Nat,
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    } else {
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
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
