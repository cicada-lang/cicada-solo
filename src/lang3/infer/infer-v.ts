import * as Infer from "../infer"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function infer_v(mod: Mod.Mod, ctx: Ctx.Ctx, v: Exp.v): Value.Value {
  const t = Ctx.lookup(ctx, v.name) || Mod.lookup_type(mod, v.name)
  if (t !== undefined) return t
  throw new Trace.Trace(Evaluate.explain_name_undefined(v.name))
}
