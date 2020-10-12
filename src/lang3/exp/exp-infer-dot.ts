import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_dot(mod: Mod.Mod, ctx: Ctx.Ctx, dot: Exp.dot): Value.Value {
  const target_t = Exp.infer(mod, ctx, dot.target)
  const cls = Value.is_cls(ctx, target_t)
  return Exp.do_dot(cls, dot.name)
}
