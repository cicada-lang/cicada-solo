import * as Ctx from "../ctx"
import * as Ty from "../ty"

export function extend(ctx: Ctx.Ctx, name: string, t: Ty.Ty): Ctx.Ctx {
  ctx.set(name, { t })
  return ctx
}
