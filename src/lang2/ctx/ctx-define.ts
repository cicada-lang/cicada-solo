import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Value from "../value"

export function define(
  ctx: Ctx.Ctx,
  name: string,
  t: Ty.Ty,
  value: Value.Value
): Ctx.Ctx {
  ctx.set(name, { t, value })
  return ctx
}
