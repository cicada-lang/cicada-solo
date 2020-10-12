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
  const u = Exp.infer(mod, ctx, exp)
  if (!Value.subtype(mod, ctx, u, t)) {
    let u_repr = Exp.repr(Value.readback(mod, ctx, Value.type, u))
    u_repr = u_repr.replace(/\s+/g, " ")
    throw new Trace.Trace(
      ut.aline(`
        |I infer the type of ${Exp.repr(exp)} to be ${u_repr}.
        |But the given type is ${Exp.repr(
          Value.readback(mod, ctx, Value.type, t)
        )}.
        |`)
    )
  }
}
