import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Readback from "../readback"

export function conversion(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  x: Value.Value,
  y: Value.Value
): boolean {
  if (x === y) return true
  return Exp.equivalent(
    Readback.readback(mod, ctx, t, x),
    Readback.readback(mod, ctx, t, y)
  )
}
