import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function subtype(ctx: Ctx.Ctx, x: Value.Value, y: Value.Value): boolean {
  if (Value.conversion(ctx, Value.type, x, y)) return true
  else if (x.kind === "Value.quote" && y.kind === "Value.str") return true
  else if (x.kind === "Value.union")
    return Value.subtype(ctx, x.left, y) && Value.subtype(ctx, x.right, y)
  else if (y.kind === "Value.union")
    return Value.subtype(ctx, x, y.left) || Value.subtype(ctx, x, y.right)
  else return false
}
