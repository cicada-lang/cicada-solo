import * as Ctx from "../ctx"

export function names(ctx: Ctx.Ctx): Array<string> {
  return Array.from(ctx.keys())
}
