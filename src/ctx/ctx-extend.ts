import * as Ctx from "../ctx"

import * as Value from "../value"

export function extend(
  ctx: Ctx.Ctx,
  name: string,
  t: Value.Value,
  value?: Value.Value
): Ctx.Ctx {
  return new Map([...ctx, [name, { t, value }]])
}
