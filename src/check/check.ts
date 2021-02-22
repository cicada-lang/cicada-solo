import { readback } from "../readback"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Ctx from "../ctx"
import * as Trace from "../trace"
import * as ut from "../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Value.Value): void {
  try {
    if (exp.check) {
      return exp.check(ctx, t)
    } else if (exp.infer) {
      const u = exp.infer(ctx)
      if (!Value.conversion(ctx, Value.type, t, u)) {
        throw new Trace.Trace(
          ut.aline(`
              |I infer the type to be ${readback(ctx, Value.type, u).repr()}.
              |But the given type is ${readback(ctx, Value.type, t).repr()}.
              |`)
        )
      }
    } else {
      throw new Trace.Trace(
        ut.aline(`
          |I can not check the type of ${exp.repr()}.
          |I also can not check it by infer.
          |I suggest you add a type annotation to the expression.
          |`)
      )
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
