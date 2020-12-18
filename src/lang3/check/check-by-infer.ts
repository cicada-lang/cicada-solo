import * as Check from "../check"
import * as Infer from "../infer"
import * as Readback from "../readback"

import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_by_infer(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  exp: Exp.Exp,
  t: Value.Value
): void {
  const u = Infer.infer(mod, ctx, exp)
  if (!Value.subtype(mod, ctx, u, t)) {
    const u_repr = Readback.readback(mod, ctx, Value.type, u)
      .repr()
      .replace(/\s+/g, " ")
    const t_repr = Readback.readback(mod, ctx, Value.type, t)
      .repr()
      .replace(/\s+/g, " ")
    throw new Trace.Trace(
      ut.aline(`
        |I infer the type to be ${u_repr}.
        |But the given type is ${t_repr}.
        |`)
    )
  }
}
