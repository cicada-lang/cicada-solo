import * as Check from "../check"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    return exp.checkability(t, { ctx })
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}
