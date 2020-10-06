import * as Value from "../value"
import * as Ty from "../ty"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function conversion(
  ctx: Ctx.Ctx,
  t: Ty.Ty,
  x: Value.Value,
  y: Value.Value
): boolean {
  return Exp.alpha_equal(Value.readback(ctx, t, x), Value.readback(ctx, t, y))
}
