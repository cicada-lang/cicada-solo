import * as Check from "../check"
import * as Infer from "../infer"
import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Value.Value): void {
  try {
    if (exp.kind === "Exp.fn") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.cons") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.same") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.begin") {
      return exp.checkability(t, { ctx })
    } else {
      const u = Infer.infer(ctx, exp)
      if (!Value.conversion(ctx, Value.type, t, u)) {
        throw new Trace.Trace(
          ut.aline(`
          |I infer the type of ${exp.repr()} to be ${Readback.readback(
            ctx,
            Value.type,
            u
          ).repr()}.
          |But the given type is ${Readback.readback(
            ctx,
            Value.type,
            t
          ).repr()}.
          |`)
        )
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    } else {
      throw error
    }
  }
}
