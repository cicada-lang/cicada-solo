import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    if (exp.kind === "Exp.fn") {
      if (t.kind === "Ty.arrow") {
        ctx = Ctx.clone(ctx)
        Ctx.update(ctx, exp.name, t.arg_t)
        Exp.check(ctx, exp.ret, t.ret_t)
        return
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.arrow,
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.zero") {
      if (t.kind === "Ty.nat") {
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.nat,
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.add1") {
      if (t.kind === "Ty.nat") {
        Exp.check(ctx, exp.prev, t)
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${Exp.repr(exp)},
            |I am expecting the type to be Ty.nat,
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.begin") {
      const { stmts, ret } = exp
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(ctx, stmt)
      }
      Exp.check(ctx, ret, t)
    } else {
      const u = Exp.infer(ctx, exp)
      // NOTE Comparing equivalent between `Ty` is simple.
      // - For dependent type, we will need to use `Value.conversion`.
      if (ut.equal(t, u)) {
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
