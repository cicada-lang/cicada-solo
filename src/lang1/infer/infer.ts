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
      return exp.inferability({ ctx })
    }

    if (exp.kind === "Exp.ap") {
      return exp.inferability({ ctx })
    }

    if (exp.kind === "Exp.begin") {
      const new_ctx = Ctx.clone(ctx)
      for (const stmt of exp.stmts) {
        Stmt.declare(new_ctx, stmt)
      }
      return Infer.infer(new_ctx, exp.ret)
    }

    if (exp.kind === "Exp.rec") {
      const { t, target, base, step } = exp
      // NOTE target should always be infered,
      // but it is simple to just check it here,
      // because we already know it should be `Ty.nat`.
      Check.check(ctx, target, Ty.nat)
      Check.check(ctx, base, t)
      Check.check(ctx, step, Ty.arrow(Ty.nat, Ty.arrow(t, t)))
      return t
    }

    if (exp.kind === "Exp.the") {
      const the = exp
      Check.check(ctx, the.exp, the.t)
      return the.t
    }

    throw new Trace.Trace(
      ut.aline(`
        |I can not infer the type of ${exp.repr()}.
        |I suggest you add a type annotation to the expression.
        |`)
    )
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
