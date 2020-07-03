import * as Ctx from "../ctx"
import * as Ty from "../ty"

export function clone(ctx: Ctx.Ctx): Ctx.Ctx {
  return new Map(ctx)
}
