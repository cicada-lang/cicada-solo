import * as Ctx from "../ctx"
import * as Value from "../value"

export function lookup(ctx: Ctx.Ctx, name: string): undefined | Value.Value {
  const entry = ctx.get(name)
  if (entry !== undefined) {
    return entry.t
  } else {
    return undefined
  }
}
