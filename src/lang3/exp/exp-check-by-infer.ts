import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_by_infer(ctx: Ctx.Ctx, exp: Exp.Exp, t: Value.Value): void {
  const u = Exp.infer(ctx, exp)
  if (!Value.subtype(ctx, u, t)) {
    let u_repr = Exp.repr(Value.readback(ctx, Value.type, u))
    u_repr = u_repr.replace(/\s+/g, " ")
    throw new Trace.Trace(
      ut.aline(`
        |I infer the type of ${Exp.repr(exp)} to be ${u_repr}.
        |But the given type is ${Exp.repr(Value.readback(ctx, Value.type, t))}.
        |`)
    )
  }
}
