import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_v(mod: Mod.Mod, ctx: Ctx.Ctx, v: Exp.v): Value.Value {
  const t = Ctx.lookup(ctx, v.name)
  if (t === undefined) {
    throw new Trace.Trace(Exp.explain_name_undefined(v.name))
  }
  return t
}
