import * as Ctx from "../ctx"
import * as Ty from "../ty"

export function lookup(ctx: Ctx.Ctx, name: string): undefined | Ty.Ty {
  return ctx.get(name)
}
