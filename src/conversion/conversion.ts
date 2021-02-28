import { Value } from "../value"
import { Ctx } from "../ctx"
import { equivalent } from "../exp"
import { readback } from "../readback"

export function conversion(ctx: Ctx, t: Value, x: Value, y: Value): boolean {
  return equivalent(readback(ctx, t, x), readback(ctx, t, y))
}
