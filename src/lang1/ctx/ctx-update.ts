import * as Ctx from "../ctx"
import * as Ty from "../ty"

export function update(ctx: Ctx.Ctx, name: string, value: Ty.Ty): Ctx.Ctx {
  ctx.set(name, value)
  return ctx
}
