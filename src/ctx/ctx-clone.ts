import * as Ctx from "../ctx"

export function clone(ctx: Ctx.Ctx): Ctx.Ctx {
  return new Map(ctx)
}
