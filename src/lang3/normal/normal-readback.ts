import * as Normal from "../normal"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function readback(ctx: Ctx.Ctx, normal: Normal.Normal): Exp.Exp {
  return Value.readback(mod, ctx, normal.t, normal.value)
}
