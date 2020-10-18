import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function conversion(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  x: Value.Value,
  y: Value.Value
): boolean {
  if (x === y) return true
  return Exp.alpha_equivalent(
    Value.readback(mod, ctx, t, x),
    Value.readback(mod, ctx, t, y)
  )
}
