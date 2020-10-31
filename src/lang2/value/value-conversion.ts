import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Readback from "../readback"

export function conversion(
  ctx: Ctx.Ctx,
  t: Value.Value,
  x: Value.Value,
  y: Value.Value
): boolean {
  return Exp.equivalent(Readback.readback(ctx, t, x), Readback.readback(ctx, t, y))
}
