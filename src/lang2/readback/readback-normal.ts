import * as Readback from "../readback"
import * as Normal from "../normal"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function readback_normal(ctx: Ctx.Ctx, normal: Normal.Normal): Exp.Exp {
  return Readback.readback(ctx, normal.t, normal.value)
}
