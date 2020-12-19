import * as Infer from "../infer"
import * as Explain from "../explain"
import * as Evaluate from "../evaluate"
import * as Check from "../check"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Ty.Ty {
  try {
    if (exp.kind === "Exp.v") {
      const t = Ctx.lookup(ctx, exp.name)
      if (t === undefined) {
        throw new Trace.Trace(Explain.explain_name_undefined(exp.name))
      }
      return t
    } else if (exp.kind === "Exp.ap") {
      const { target, arg } = exp
      const target_t = Infer.infer(ctx, target)
      if (target_t.kind === "Ty.arrow") {
        Check.check(ctx, arg, target_t.arg_t)
        return target_t.ret_t
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |I am expecting the target_t to be Ty.arrow,
            |but it is ${Ty.repr(target_t)}.
            |`)
        )
      }
    } else if (exp.kind === "Exp.begin") {
      const new_ctx = Ctx.clone(ctx)
      for (const stmt of exp.stmts) {
        Stmt.declare(new_ctx, stmt)
      }
      return Infer.infer(new_ctx, exp.ret)
    } else if (exp.kind === "Exp.rec") {
      const { t, target, base, step } = exp
      // NOTE target should always be infered,
      // but it is simple to just check it here,
      // because we already know it should be `Ty.nat`.
      Check.check(ctx, target, Ty.nat)
      Check.check(ctx, base, t)
      Check.check(ctx, step, Ty.arrow(Ty.nat, Ty.arrow(t, t)))
      return t
    } else if (exp.kind === "Exp.the") {
      const the = exp
      Check.check(ctx, the.exp, the.t)
      return the.t
    } else {
      throw new Trace.Trace(
        ut.aline(`
          |I can not infer the type of ${exp.repr()}.
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
