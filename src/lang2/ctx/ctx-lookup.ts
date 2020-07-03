import * as Ctx from "../ctx"
import * as Ty from "../ty"

export function lookup(ctx: Ctx.Ctx, name: string): undefined | Ty.Ty {
  const entry = ctx.get(name)
  if (entry !== undefined) {
    return entry.t
  } else {
    return undefined
  }
}
