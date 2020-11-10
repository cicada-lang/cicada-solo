import * as Readback from "../readback"
import * as Normal from "../normal"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function readback_normal(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  normal: Normal.Normal
): Exp.Exp {
  return Readback.readback(mod, ctx, normal.t, normal.value)
}
