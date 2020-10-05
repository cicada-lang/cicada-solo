import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Value from "../value"

export function extend(
  ctx: Ctx.Ctx,
  name: string,
  t: Ty.Ty,
  value?: Value.Value
): Ctx.Ctx {
  return Ctx.update(Ctx.clone(ctx), name, t, value)
}
