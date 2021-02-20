import * as Ctx from "../ctx"

import * as Value from "../value"

export function update(
  ctx: Ctx.Ctx,
  name: string,
  t: Value.Value,
  value?: Value.Value
): Ctx.Ctx {
  ctx.set(name, { t, value })
  return ctx
}
