import * as Ctx from "../ctx"
import * as Ty from "../ty"

// NOTE side effect API,
//   one needs to clone the env as needed.
export function extend(ctx: Ctx.Ctx, name: string, value: Ty.Ty): Ctx.Ctx {
  ctx.set(name, value)
  return ctx
}
