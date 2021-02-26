import * as Infer from "../infer"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../trace"
import * as ut from "../ut"



export function infer(ctx: Ctx.Ctx, exp: Exp.Exp): Value.Value {
  try {
    if (exp.infer) {
      return exp.infer(ctx)
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
