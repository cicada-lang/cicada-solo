import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_fill(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  fill: Exp.fill
): Value.type {
  Exp.check(mod, ctx, fill.target, Value.type)
  const target = Exp.evaluate(mod, Ctx.to_env(ctx), fill.target)
  const cls = Value.is_cls(mod, ctx, target)
  if (cls.tel.next === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |The telescope of the cls is full.
        |`)
    )
  }
  Exp.check(mod, ctx, fill.arg, cls.tel.next.t)
  return Value.type
}
