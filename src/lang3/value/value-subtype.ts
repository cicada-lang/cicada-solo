import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"

export function subtype(ctx: Ctx.Ctx, x: Value.Value, y: Value.Value): boolean {
  return (
    Value.conversion(ctx, Value.type, x, y) ||
    (x.kind === "Value.quote" && y.kind === "Value.str")
  )
}
